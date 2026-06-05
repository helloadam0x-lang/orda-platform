const express = require('express')
const router = express.Router()
const { initClient, disconnectClient, qrCodes, statuses } = require('../whatsapp')

router.get('/qr', async (req, res) => {
  const { businessId } = req.query
  if (!businessId) return res.status(400).json({ error: 'businessId required' })

  const status = statuses.get(businessId)
  if (status === 'connected') return res.json({ status: 'connected' })

  if (!status || status === 'disconnected') initClient(businessId)

  let count = 0
  const poll = setInterval(() => {
    count++
    const s = statuses.get(businessId)
    const qr = qrCodes.get(businessId)

    if (s === 'connected') { clearInterval(poll); return res.json({ status: 'connected' }) }
    if (qr) { clearInterval(poll); return res.json({ status: 'qr_ready', qr }) }
    if (count >= 40) { clearInterval(poll); return res.status(408).json({ error: 'Timeout. Try again.' }) }
  }, 1000)
})

router.get('/status', (req, res) => {
  const { businessId } = req.query
  if (!businessId) return res.status(400).json({ error: 'businessId required' })
  res.json({
    status: statuses.get(businessId) || 'disconnected',
    qr: qrCodes.get(businessId) || null,
  })
})

router.post('/disconnect', async (req, res) => {
  const { businessId } = req.body
  if (!businessId) return res.status(400).json({ error: 'businessId required' })
  await disconnectClient(businessId)
  res.json({ success: true })
})

router.post('/send-to-customer', async (req, res) => {
  const { businessId, customerPhone, message } = req.body
  if (!businessId || !customerPhone || !message) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const client = clients.get(businessId)
  if (!client) return res.status(503).json({ error: 'WhatsApp not connected' })

  try {
    const phoneId = customerPhone.replace(/\D/g, '') + '@c.us'
    await client.sendMessage(phoneId, message)

    const { createClient } = require('@supabase/supabase-js')
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

    const { data: contact } = await supabase
      .from('contacts').select('id').eq('business_id', businessId)
      .eq('phone', customerPhone).single()

    if (contact) {
      const { data: conversation } = await supabase
        .from('conversations').select('id')
        .eq('business_id', businessId).eq('contact_id', contact.id)
        .eq('status', 'open').single()

      if (conversation) {
        await supabase.from('messages').insert({
          conversation_id: conversation.id,
          business_id: businessId,
          content: message,
          role: 'owner',
          platform: 'whatsapp',
          is_ai: false,
          read: true,
        })
      }
    }
    res.json({ success: true })
  } catch (err) {
    console.error('[Send to customer error]', err.message)
    res.status(500).json({ error: err.message })
  }
})

router.post('/notify', async (req, res) => {
  const { businessId, message } = req.body
  if (!businessId || !message) return res.status(400).json({ error: 'Missing fields' })
  const { notifyOwner } = require('../notify')
  await notifyOwner(businessId, message)
  res.json({ success: true })
})

router.post('/send-to-owner', async (req, res) => {
  const { businessId, phone, message } = req.body
  if (!businessId || !phone || !message) return res.status(400).json({ error: 'Missing fields' })
  const { clients } = require('../whatsapp')
  const client = clients.get(businessId)
  if (!client) return res.json({ ok: false, reason: 'not_connected' })
  try {
    const to = phone.replace(/\D/g, '') + '@c.us'
    await client.sendMessage(to, message)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/broadcast', async (req, res) => {
  const { businessId, message, audience } = req.body
  if (!businessId || !message) return res.status(400).json({ error: 'Missing fields' })
  const { clients } = require('../whatsapp')
  const client = clients.get(businessId)
  if (!client) return res.status(503).json({ error: 'WhatsApp not connected' })

  const { createClient } = require('@supabase/supabase-js')
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

  let q = supabase.from('contacts').select('name, phone').eq('business_id', businessId).eq('is_blocked', false)
  if (audience === 'vip') q = q.eq('is_vip', true)
  if (audience === 'ordered') q = q.gt('order_count', 0)

  const { data: contacts } = await q
  if (!contacts) return res.json({ sent: 0 })

  let sent = 0
  for (const c of contacts) {
    try {
      const personalised = message.replace(/\{\{name\}\}/g, c.name ?? 'Customer')
      const phone = c.phone.replace(/\D/g, '') + '@c.us'
      await client.sendMessage(phone, personalised)
      sent++
      await new Promise(r => setTimeout(r, 600))
    } catch {}
  }
  res.json({ sent })
})

module.exports = router
