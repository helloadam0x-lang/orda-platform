import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BroadcastsView from '@/components/dashboard/BroadcastsView'
import type { Broadcast } from '@/types/database'

export default async function BroadcastsPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/sign-in')

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', session.user.id)
    .single()

  if (!business) redirect('/onboarding')

  const { data: broadcasts, error } = await supabase
    .from('broadcasts')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false })

  const list = error ? [] : (broadcasts ?? []) as Broadcast[]

  const stats = {
    totalSent:      list.filter(b => b.status === 'sent').reduce((s, b) => s + b.sent_count, 0),
    totalDelivered: list.filter(b => b.status === 'sent').reduce((s, b) => s + b.delivered_count, 0),
    avgOpenRate:    list.length > 0
      ? Math.round(list.reduce((s, b) => s + (b.recipient_count > 0 ? (b.delivered_count / b.recipient_count) * 100 : 0), 0) / list.length)
      : 0,
    totalReached: list.reduce((s, b) => s + b.recipient_count, 0),
  }

  return <BroadcastsView broadcasts={list} stats={stats} businessId={business.id} />
}
