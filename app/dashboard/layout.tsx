import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardShell from '@/components/dashboard/DashboardShell'
import type { Business } from '@/types/database'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in')

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const userName = (user.user_metadata?.full_name as string | undefined) ?? user.email ?? 'User'

  return (
    <DashboardShell
      business={business as Business | null}
      userName={userName}
      userEmail={user.email ?? ''}
    >
      {children}
    </DashboardShell>
  )
}
