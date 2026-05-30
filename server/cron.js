require('dotenv').config()
const db = require('./db')
const { notifyOwner } = require('./notify')

async function sendDailySummary() {
  console.log('[Cron] Running daily summary...')
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  yesterday.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const businesses = await db.getBusinessesForSummary()
  for (const biz of businesses) {
    try {
      const stats = await db.getBusinessDailyStats(biz.id, yesterday.toISOString(), today.toISOString())
      if (!stats) continue
      const { total_orders, total_revenue, total_messages } = stats

      if (total_orders === 0 && total_messages === 0) continue

      const summary = `☀️ *Good morning, ${biz.name}!*

Here's yesterday's summary:

🛍️ Orders: *${total_orders}*
💰 Revenue: *${biz.currency || 'UGX'} ${Number(total_revenue).toLocaleString()}*
💬 Messages handled by AI: *${total_messages}*

${total_orders > 0 ? `Keep it up! Your AI worked all night. 🚀` : `A slow day — your AI was ready all day though.`}

_Powered by Orda AI_`

      await notifyOwner(biz.id, summary)
    } catch (err) {
      console.error(`[Cron] Summary failed for ${biz.name}:`, err.message)
    }
  }
}

async function sendWeeklyReport() {
  console.log('[Cron] Running weekly report...')
  const now = new Date()
  if (now.getDay() !== 1) return

  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  const businesses = await db.getBusinessesForSummary()
  for (const biz of businesses) {
    try {
      const stats = await db.getBusinessDailyStats(biz.id, weekAgo.toISOString(), now.toISOString())
      if (!stats) continue
      const { total_orders, total_revenue, total_messages } = stats

      const report = `📊 *Weekly Report — ${biz.name}*

Week ending ${now.toLocaleDateString('en-UG', { timeZone: 'Africa/Kampala' })}:

🛍️ Total Orders: *${total_orders}*
💰 Total Revenue: *${biz.currency || 'UGX'} ${Number(total_revenue).toLocaleString()}*
💬 Messages AI handled: *${total_messages}*

${total_orders > 3 ? `🔥 Great week! Your AI is working.` : `Keep sharing your store link to get more orders.`}

_Your Orda AI report_`

      await notifyOwner(biz.id, report)
    } catch (err) {
      console.error(`[Cron] Weekly report failed for ${biz.name}:`, err.message)
    }
  }
}

// Check every minute — fires at 05:00 UTC (08:00 EAT)
setInterval(async () => {
  const now = new Date()
  if (now.getUTCHours() === 5 && now.getUTCMinutes() === 0) {
    await sendDailySummary()
    if (now.getDay() === 1) await sendWeeklyReport()
  }
}, 60 * 1000)

module.exports = { sendDailySummary, sendWeeklyReport }
