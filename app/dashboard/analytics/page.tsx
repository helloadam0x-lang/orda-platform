import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AnalyticsView from '@/components/dashboard/AnalyticsView'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/sign-in')

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', session.user.id)
    .single()

  if (!business) redirect('/onboarding')

  const id  = business.id
  const now = new Date()
  const d30 = new Date(now); d30.setDate(d30.getDate() - 30)
  const d60 = new Date(now); d60.setDate(d60.getDate() - 60)

  const [
    { data: messages30 },
    { data: messages60 },
    { count: conversations30 },
    { count: conversations60 },
    { data: contacts30 },
    { data: contacts60 },
    { data: orders30 },
    { data: orders60 },
    { data: topContacts },
    { data: platformMsgs },
  ] = await Promise.all([
    supabase.from('messages')
      .select('created_at, sender_type, conversation_id')
      .gte('created_at', d30.toISOString()),
    supabase.from('messages')
      .select('created_at')
      .gte('created_at', d60.toISOString())
      .lt('created_at', d30.toISOString()),
    supabase.from('conversations').select('*', { count: 'exact', head: true })
      .eq('business_id', id).gte('created_at', d30.toISOString()),
    supabase.from('conversations').select('*', { count: 'exact', head: true })
      .eq('business_id', id).gte('created_at', d60.toISOString()).lt('created_at', d30.toISOString()),
    supabase.from('contacts').select('created_at').eq('business_id', id).gte('created_at', d30.toISOString()),
    supabase.from('contacts').select('created_at').eq('business_id', id).gte('created_at', d60.toISOString()).lt('created_at', d30.toISOString()),
    supabase.from('orders').select('created_at, amount, status').eq('business_id', id).gte('created_at', d30.toISOString()),
    supabase.from('orders').select('created_at, amount, status').eq('business_id', id).gte('created_at', d60.toISOString()).lt('created_at', d30.toISOString()),
    supabase.from('contacts').select('id, name, total_orders, total_spent, last_active').eq('business_id', id).order('total_spent', { ascending: false }).limit(10),
    supabase.from('conversations').select('platform, id').eq('business_id', id),
  ])

  // KPI data
  const msgCount30  = (messages30 ?? []).length
  const msgCount60  = (messages60 ?? []).length
  const revCount30  = (orders30 ?? []).filter(o => o.status === 'delivered').reduce((s: number, o: { amount: number }) => s + o.amount, 0)
  const revCount60  = (orders60 ?? []).filter(o => o.status === 'delivered').reduce((s: number, o: { amount: number }) => s + o.amount, 0)
  const ordComp30   = (orders30 ?? []).filter(o => o.status === 'delivered').length
  const ordComp60   = (orders60 ?? []).filter(o => o.status === 'delivered').length

  const kpis = [
    { label: 'Total Messages', value: msgCount30,              prev: msgCount60, format: 'number' },
    { label: 'Conversations',  value: conversations30 ?? 0,   prev: conversations60 ?? 0, format: 'number' },
    { label: 'New Contacts',   value: (contacts30 ?? []).length, prev: (contacts60 ?? []).length, format: 'number' },
    { label: 'Orders Completed', value: ordComp30,            prev: ordComp60, format: 'number' },
    { label: 'Revenue',        value: revCount30,             prev: revCount60, format: 'currency' },
    { label: 'AI Messages',    value: (messages30 ?? []).filter((m: { sender_type: string }) => m.sender_type === 'ai').length, prev: 0, format: 'number' },
  ]

  // Daily message volume (last 30 days)
  const dailyMap: Record<string, { messages: number; ai_replies: number }> = {}
  const days30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now); d.setDate(d.getDate() - (29 - i))
    return d.toISOString().split('T')[0]
  })
  days30.forEach(d => { dailyMap[d] = { messages: 0, ai_replies: 0 } })
  ;(messages30 ?? []).forEach((m: { created_at: string; sender_type: string }) => {
    const day = m.created_at.split('T')[0]
    if (dailyMap[day]) {
      dailyMap[day].messages++
      if (m.sender_type === 'ai') dailyMap[day].ai_replies++
    }
  })
  const dailyMessages = days30.map(d => ({ day: d.slice(5), messages: dailyMap[d].messages, ai_replies: dailyMap[d].ai_replies }))

  // Daily revenue
  const revMap: Record<string, number> = {}
  days30.forEach(d => { revMap[d] = 0 })
  ;(orders30 ?? []).filter((o: { status: string }) => o.status === 'delivered').forEach((o: { created_at: string; amount: number }) => {
    const day = o.created_at.split('T')[0]
    if (revMap[day] !== undefined) revMap[day] += o.amount
  })
  const dailyRevenue = days30.map(d => ({ day: d.slice(5), revenue: revMap[d] }))

  // Platform distribution
  const platformCounts: Record<string, number> = {}
  ;(platformMsgs ?? []).forEach((c: { platform: string }) => {
    platformCounts[c.platform] = (platformCounts[c.platform] ?? 0) + 1
  })
  const platformData = Object.entries(platformCounts).map(([platform, count]) => ({ platform, count }))

  // Hourly heatmap (by day of week + hour)
  const heatmap: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0))
  ;(messages30 ?? []).forEach((m: { created_at: string }) => {
    const d = new Date(m.created_at)
    heatmap[d.getDay()][d.getHours()]++
  })

  // Conversion funnel
  const funnel = [
    { label: 'Messages',          count: msgCount30 },
    { label: 'Conversations',     count: conversations30 ?? 0 },
    { label: 'Orders Created',    count: (orders30 ?? []).length },
    { label: 'Orders Paid',       count: ordComp30 },
    { label: 'Repeat Customers',  count: (topContacts ?? []).filter((c: { total_orders: number }) => c.total_orders > 1).length },
  ]

  return (
    <AnalyticsView
      kpis={kpis}
      dailyMessages={dailyMessages}
      dailyRevenue={dailyRevenue}
      platformData={platformData}
      topContacts={(topContacts ?? []) as { id: string; name: string; total_orders: number; total_spent: number; last_active: string | null }[]}
      heatmap={heatmap}
      funnel={funnel}
    />
  )
}
