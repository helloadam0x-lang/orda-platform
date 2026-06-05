const RESEND_API_KEY = process.env.RESEND_API_KEY!
const FROM = 'Orda <hello@getorda.app>'

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY || RESEND_API_KEY.startsWith('re_placeholder')) return
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  })
}

export async function sendWelcomeEmail(to: string, name: string) {
  await sendEmail(
    to,
    'Welcome to Orda — Your AI is ready',
    `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px">
      <h1 style="font-size:28px;font-weight:900;color:#111">Welcome, ${name}!</h1>
      <p style="color:#555;line-height:1.6">Your Orda account is ready. Connect your WhatsApp to activate your AI agent.</p>
      <a href="https://getorda.app/dashboard/connect" style="display:inline-block;margin-top:24px;padding:12px 24px;background:#D4A853;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">Connect WhatsApp →</a>
      <p style="margin-top:32px;color:#999;font-size:13px">Orda Technologies Ltd · Kampala, Uganda</p>
    </div>`,
  )
}

export async function sendOrderConfirmationEmail(to: string, orderNumber: string, total: string, businessName: string) {
  await sendEmail(
    to,
    `Order ${orderNumber} confirmed — ${businessName}`,
    `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px">
      <h1 style="font-size:24px;font-weight:900;color:#111">Order Confirmed</h1>
      <p style="color:#555">Your order <strong>${orderNumber}</strong> has been confirmed by ${businessName}.</p>
      <p style="font-size:20px;font-weight:700;color:#111;margin-top:16px">Total: ${total}</p>
      <a href="https://getorda.app/track/${orderNumber}" style="display:inline-block;margin-top:24px;padding:12px 24px;background:#D4A853;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">Track Order →</a>
    </div>`,
  )
}

export async function sendTrialEndingEmail(to: string, name: string, daysLeft: number) {
  await sendEmail(
    to,
    `Your Orda trial ends in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`,
    `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px">
      <h1 style="font-size:24px;font-weight:900;color:#111">Trial ending soon</h1>
      <p style="color:#555">Hi ${name}, your free trial ends in <strong>${daysLeft} day${daysLeft === 1 ? '' : 's'}</strong>. Upgrade to keep your AI running 24/7.</p>
      <a href="https://getorda.app/dashboard/billing" style="display:inline-block;margin-top:24px;padding:12px 24px;background:#D4A853;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">Upgrade Now →</a>
    </div>`,
  )
}
