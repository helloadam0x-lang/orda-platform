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

module.exports = router
