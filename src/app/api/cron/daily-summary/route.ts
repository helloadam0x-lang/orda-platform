import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient()
  const { data: businesses } = await supabase
    .from('businesses')
    .select('id, name, notification_phone, whatsapp_phone')
    .eq('is_whatsapp_connected', true)
    .eq('auto_reply', true)

  if (!businesses) return NextResponse.json({ sent: 0 })

  const expressUrl = process.env.EXPRESS_URL ?? 'http://localhost:3001'
  let sent = 0

  for (const biz of businesses) {
    try {
      const { data: stats } = await supabase.rpc('get_order_stats', { p_business_id: biz.id })
      if (!stats) continue

      const phone = biz.notification_phone || biz.whatsapp_phone
      if (!phone) continue

      const message = `📊 *Daily Summary — ${biz.name}*\n\nOrders today: ${(stats as any).total_today ?? 0}\nRevenue today: ${(stats as any).revenue_today ?? 0}\nPending: ${(stats as any).pending ?? 0}\n\nHave a great day! 🌟`

      await fetch(`${expressUrl}/whatsapp/send-to-owner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId: biz.id, phone, message }),
        signal: AbortSignal.timeout(5000),
      })
      sent++
    } catch {}
  }

  // Keep Render server warm
  fetch('https://orda-whatsapp-server.onrender.com/health', {
    signal: AbortSignal.timeout(5000),
  }).catch(() => {})

  return NextResponse.json({ sent, timestamp: new Date().toISOString() })
}
