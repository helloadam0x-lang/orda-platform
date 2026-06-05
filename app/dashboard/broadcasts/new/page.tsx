import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import NewBroadcastForm from '@/components/dashboard/NewBroadcastForm'

export default async function NewBroadcastPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/sign-in')

  const { data: business } = await supabase
    .from('businesses')
    .select('id, name')
    .eq('user_id', session.user.id)
    .single()

  if (!business) redirect('/onboarding')

  const { count: contactCount } = await supabase
    .from('contacts')
    .select('*', { count: 'exact', head: true })
    .eq('business_id', business.id)

  return (
    <NewBroadcastForm
      businessId={business.id}
      businessName={business.name}
      totalContacts={contactCount ?? 0}
    />
  )
}
