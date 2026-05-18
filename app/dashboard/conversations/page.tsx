import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ConversationsView from '@/components/dashboard/ConversationsView'
import type { Conversation, ConvFilterCounts } from '@/types/database'

export default async function ConversationsPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/sign-in')

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', session.user.id)
    .single()

  if (!business) redirect('/onboarding')

  const id = business.id

  const [
    { data: conversations },
    { count: allCount },
    { count: openCount },
    { count: aiCount },
    { count: humanCount },
    { count: resolvedCount },
  ] = await Promise.all([
    supabase
      .from('conversations')
      .select('id, created_at, last_message_at, platform, status, is_ai_handling, last_message, unread_count, contact:contacts(name, platform, phone, email, total_orders, total_spent, last_active, tags)')
      .eq('business_id', id)
      .order('last_message_at', { ascending: false, nullsFirst: false }),
    supabase.from('conversations').select('*', { count: 'exact', head: true }).eq('business_id', id),
    supabase.from('conversations').select('*', { count: 'exact', head: true }).eq('business_id', id).eq('status', 'open'),
    supabase.from('conversations').select('*', { count: 'exact', head: true }).eq('business_id', id).eq('is_ai_handling', true),
    supabase.from('conversations').select('*', { count: 'exact', head: true }).eq('business_id', id).eq('is_ai_handling', false).neq('status', 'resolved'),
    supabase.from('conversations').select('*', { count: 'exact', head: true }).eq('business_id', id).eq('status', 'resolved'),
  ])

  const counts: ConvFilterCounts = {
    all: allCount ?? 0,
    open: openCount ?? 0,
    ai_handling: aiCount ?? 0,
    human: humanCount ?? 0,
    resolved: resolvedCount ?? 0,
  }

  return (
    <ConversationsView
      conversations={(conversations ?? []) as unknown as Conversation[]}
      counts={counts}
    />
  )
}
