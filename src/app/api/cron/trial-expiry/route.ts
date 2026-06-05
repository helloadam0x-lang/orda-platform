import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendTrialEndingEmail } from '@/lib/email'

export async function GET(request: Request) {
  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient()
  const now = new Date()
  const in3Days = new Date(now.getTime() + 3 * 86400000).toISOString()
  const in1Day = new Date(now.getTime() + 1 * 86400000).toISOString()

  const { data: expiring } = await supabase
    .from('businesses')
    .select('id, name, user_id, plan_expires_at, notification_phone, whatsapp_phone')
    .eq('plan', 'trial')
    .not('plan_expires_at', 'is', null)
    .lte('plan_expires_at', in3Days)

  if (!expiring) return NextResponse.json({ notified: 0 })

  let notified = 0
  const expressUrl = process.env.EXPRESS_URL ?? 'http://localhost:3001'

  for (const biz of expiring) {
    const expiry = new Date(biz.plan_expires_at)
    const daysLeft = Math.max(0, Math.ceil((expiry.getTime() - now.getTime()) / 86400000))

    const { data: user } = await supabase.auth.admin.getUserById(biz.user_id)
    if (user?.user?.email) {
      await sendTrialEndingEmail(user.user.email, biz.name, daysLeft).catch(() => {})
    }

    const phone = biz.notification_phone || biz.whatsapp_phone
    if (phone) {
      await fetch(`${expressUrl}/whatsapp/send-to-owner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: biz.id, phone,
          message: `⚠️ *${biz.name} — Trial ending in ${daysLeft} day${daysLeft === 1 ? '' : 's'}*\n\nUpgrade to keep your AI active: getorda.app/dashboard/billing`,
        }),
        signal: AbortSignal.timeout(5000),
      }).catch(() => {})
    }

    notified++
  }

  return NextResponse.json({ notified })
}
