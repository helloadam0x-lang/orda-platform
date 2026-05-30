require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')
const db = require('./db')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

const NEXT_URL = process.env.NEXT_URL || 'http://localhost:3000'

async function notifyOwner(businessId, message) {
  try {
    const biz = await db.getBusinessNotifySettings(businessId)
    if (!biz || !biz.notify_whatsapp) return

    const ownerPhone = biz.notification_phone || biz.whatsapp_phone
    if (!ownerPhone) return

    // Lazy-require to avoid circular dep at module init time
    const { clients } = require('./whatsapp')
    const client = clients.get(businessId)
    if (!client) return

    const phoneId = ownerPhone.replace(/\D/g, '') + '@c.us'
    await client.sendMessage(phoneId, message)
  } catch (err) {
    console.error('[Notify] Failed to notify owner:', err.message)
  }
}

async function triggerPushForNewMessage(businessId, profileName, messageText) {
  try {
    await fetch(`${NEXT_URL}/api/push/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessId,
        title: `💬 ${profileName}`,
        body: messageText.substring(0, 60),
        tag: 'whatsapp-message',
        url: '/dashboard/conversations',
      }),
      signal: AbortSignal.timeout(5000),
    })
  } catch {
    // Non-critical — fail silently
  }
}

module.exports = { notifyOwner, triggerPushForNewMessage }
