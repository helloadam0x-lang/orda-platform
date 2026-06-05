import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ContactsView from '@/components/dashboard/ContactsView'
import type { Contact } from '@/types/database'

export default async function ContactsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in')

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!business) redirect('/onboarding')

  const { data: contacts } = await supabase
    .from('contacts')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false })

  return (
    <ContactsView
      contacts={(contacts ?? []) as Contact[]}
      businessId={business.id}
    />
  )
}
