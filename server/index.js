require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { startWatchdog, restoreConnections } = require('./whatsapp')
const whatsappRoutes = require('./routes/whatsapp')

const app = express()

app.use(cors({
  origin: [
    'https://orda-landing-adam-s-projects20.vercel.app',
    'https://getorda.app',
    process.env.NEXT_URL || 'http://localhost:3000',
  ],
  credentials: true,
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use('/whatsapp', whatsappRoutes)

app.get('/health', (_, res) => res.json({ status: 'ok' }))

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`[Express] Orda Engine live on port ${PORT}`)
  restoreConnections()
  startWatchdog()
  require('./cron') // Start daily summary + weekly report scheduler
})

// Memory watchdog (free tier 512MB)
setInterval(() => {
  const mb = process.memoryUsage().heapUsed / 1024 / 1024
  if (mb > 450) console.warn('[Orda] High memory:', Math.round(mb) + 'MB')
}, 60000)

process.on('SIGTERM', async () => {
  console.log('[Orda] Shutting down gracefully...')
  try {
    const { clients } = require('./whatsapp')
    for (const [, client] of clients.entries()) {
      await client.destroy().catch(() => {})
    }
  } catch {}
  process.exit(0)
})

process.on('uncaughtException', (err) => {
  console.error('[Orda] Uncaught exception:', err.message)
})

process.on('unhandledRejection', (reason) => {
  console.error('[Orda] Unhandled rejection:', reason)
})
