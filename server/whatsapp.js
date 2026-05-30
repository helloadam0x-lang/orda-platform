const { Client, LocalAuth } = require('whatsapp-web.js')
const QRCode = require('qrcode')
const db = require('./db')
const { generateReply } = require('./ai')
const { triggerPushForNewMessage } = require('./notify')

const clients = new Map()
const qrCodes = new Map()
const statuses = new Map()
const retryTimers = new Map()

const RECONNECT_DELAY_MS = 5000
const WATCHDOG_INTERVAL_MS = 300000

async function handleMessage(businessId, customerPhone, text, profileName) {
  try {
    const biz = await db.getBusinessById(businessId)
    if (!biz || !biz.auto_reply) return null

    const contactId = await db.upsertContact(businessId, customerPhone, profileName)
    const conversationId = await db.upsertConversation(businessId, contactId, text)
    await db.saveMessage(conversationId, businessId, text, 'customer', false)

    const history = await db.getHistory(conversationId)
    const aiReply = await generateReply(text, biz, history)

    await db.saveMessage(conversationId, businessId, aiReply, 'ai', true)
    await db.updateConversationAfterReply(conversationId, aiReply)
    await db.createNotification(businessId, profileName, text, conversationId)
    triggerPushForNewMessage(businessId, profileName, text)

    return aiReply
  } catch (err) {
    console.error(`[Message Error] Business ${businessId}:`, err.message)
    return null
  }
}

async function initClient(businessId) {
  if (clients.has(businessId)) {
    try { await clients.get(businessId).destroy() } catch {}
    clients.delete(businessId)
  }
  if (retryTimers.has(businessId)) {
    clearTimeout(retryTimers.get(businessId))
    retryTimers.delete(businessId)
  }

  console.log(`[WhatsApp] Initializing for business: ${businessId}`)
  statuses.set(businessId, 'initializing')

  const client = new Client({
    authStrategy: new LocalAuth({
      clientId: businessId,
      dataPath: './.wa-sessions',
    }),
    puppeteer: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    },
    restartOnAuthFail: true,
  })

  client.on('qr', async (qr) => {
    console.log(`[WhatsApp] QR ready for ${businessId}`)
    statuses.set(businessId, 'qr_ready')
    try {
      const img = await QRCode.toDataURL(qr, { width: 280, margin: 2 })
      qrCodes.set(businessId, img)
    } catch (err) {
      console.error('[QR Error]', err.message)
    }
  })

  client.on('authenticated', () => {
    console.log(`[WhatsApp] Authenticated: ${businessId}`)
    statuses.set(businessId, 'authenticated')
    qrCodes.delete(businessId)
  })

  client.on('ready', async () => {
    console.log(`[WhatsApp] READY: ${businessId}`)
    statuses.set(businessId, 'connected')
    qrCodes.delete(businessId)

    const phone = client.info?.wid?.user || ''
    try {
      await db.setWhatsAppConnected(businessId, true, phone)
    } catch (err) {
      console.error('[DB Error] setWhatsAppConnected:', err.message)
    }
  })

  client.on('auth_failure', async (msg) => {
    console.error(`[WhatsApp] Auth failed for ${businessId}:`, msg)
    statuses.set(businessId, 'auth_failed')
    clients.delete(businessId)
    const timer = setTimeout(() => initClient(businessId), RECONNECT_DELAY_MS)
    retryTimers.set(businessId, timer)
  })

  client.on('disconnected', async (reason) => {
    console.log(`[WhatsApp] Disconnected (${reason}): ${businessId}`)
    statuses.set(businessId, 'reconnecting')
    clients.delete(businessId)

    try { await db.setWhatsAppConnected(businessId, false) } catch {}

    if (reason !== 'LOGOUT') {
      console.log(`[WhatsApp] Auto-reconnecting in 5s: ${businessId}`)
      const timer = setTimeout(() => initClient(businessId), RECONNECT_DELAY_MS)
      retryTimers.set(businessId, timer)
    } else {
      statuses.set(businessId, 'disconnected')
    }
  })

  client.on('message', async (msg) => {
    if (msg.fromMe || msg.isGroup || msg.type !== 'chat') return

    const customerPhone = msg.from.replace('@c.us', '')
    let profileName = customerPhone
    try {
      const contact = await msg.getContact()
      profileName = contact.pushname || contact.name || customerPhone
    } catch {}

    console.log(`[Message] From ${customerPhone}: ${msg.body.substring(0, 50)}`)

    const aiReply = await handleMessage(businessId, customerPhone, msg.body, profileName)
    if (aiReply) {
      try {
        await client.sendMessage(msg.from, aiReply)
        console.log(`[Reply] Sent to ${customerPhone}: ${aiReply.substring(0, 50)}`)
      } catch (err) {
        console.error('[Send Error]', err.message)
      }
    }
  })

  try {
    await client.initialize()
    clients.set(businessId, client)
  } catch (err) {
    console.error(`[Init Error] ${businessId}:`, err.message)
    statuses.set(businessId, 'error')
    const timer = setTimeout(() => initClient(businessId), RECONNECT_DELAY_MS * 2)
    retryTimers.set(businessId, timer)
  }

  return client
}

async function disconnectClient(businessId) {
  if (retryTimers.has(businessId)) {
    clearTimeout(retryTimers.get(businessId))
    retryTimers.delete(businessId)
  }
  if (clients.has(businessId)) {
    try { await clients.get(businessId).logout() } catch {}
    try { await clients.get(businessId).destroy() } catch {}
    clients.delete(businessId)
  }
  statuses.set(businessId, 'disconnected')
  qrCodes.delete(businessId)
  try { await db.setWhatsAppConnected(businessId, false, null) } catch {}
}

async function startWatchdog() {
  console.log('[Watchdog] Started — checking every 5 minutes')
  setInterval(async () => {
    for (const [businessId, client] of clients.entries()) {
      try {
        const state = await client.getState()
        if (state !== 'CONNECTED') {
          console.log(`[Watchdog] Reconnecting ${businessId}...`)
          initClient(businessId)
        }
      } catch {
        console.log(`[Watchdog] ${businessId} unresponsive — reconnecting`)
        initClient(businessId)
      }
    }
  }, WATCHDOG_INTERVAL_MS)
}

async function restoreConnections() {
  try {
    const businesses = await db.getConnectedBusinesses()

    if (!businesses?.length) {
      console.log('[Restore] No connected businesses to restore')
      return
    }

    console.log(`[Restore] Restoring ${businesses.length} WhatsApp connections...`)
    for (const biz of businesses) {
      console.log(`[Restore] Reconnecting: ${biz.name}`)
      await initClient(biz.id)
      await new Promise(r => setTimeout(r, 3000))
    }
  } catch (err) {
    console.error('[Restore] Failed:', err.message)
  }
}

module.exports = {
  initClient, disconnectClient, startWatchdog,
  restoreConnections, clients, qrCodes, statuses,
}
