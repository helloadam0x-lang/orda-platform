import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ConversationsView from '@/components/dashboard/ConversationsView'
import type { Conversation } from '@/types/database'

export default async function ConversationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in')

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!business) redirect('/onboarding')

  const { data: conversations } = await supabase
    .from('conversations')
    .select('id, created_at, platform, status, is_ai_handling, last_message, unread_count, contact:contacts(name, platform)')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false })

  return (
    <ConversationsView conversations={(conversations ?? []) as unknown as Conversation[]} />
  )
}
