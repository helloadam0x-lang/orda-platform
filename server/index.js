require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { startWatchdog, restoreConnections } = require('./whatsapp')
const whatsappRoutes = require('./routes/whatsapp')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/whatsapp', whatsappRoutes)

app.get('/health', (_, res) => res.json({ status: 'ok' }))

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`[Express] Orda Engine live on port ${PORT}`)
  restoreConnections()
  startWatchdog()
  require('./cron') // Start daily summary + weekly report scheduler
})
