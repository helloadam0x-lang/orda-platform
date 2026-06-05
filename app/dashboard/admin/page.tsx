import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminView from '@/components/dashboard/AdminView'

export default async function AdminPage() {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL
  if (!ADMIN_EMAIL) notFound()

  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/sign-in')

  if (session.user.email !== ADMIN_EMAIL) notFound()

  let adminClient: Awaited<ReturnType<typeof import('@/lib/supabase/admin').createAdminClient>> | null = null
  try {
    const { createAdminClient } = await import('@/lib/supabase/admin')
    adminClient = createAdminClient()
  } catch {
    notFound()
  }

  const sb = adminClient!

  const [
    { data: businesses, count: totalBusinesses },
    { count: activeCount },
  ] = await Promise.all([
    sb.from('businesses').select('*', { count: 'exact' }).order('created_at', { ascending: false }).limit(100),
    sb.from('businesses').select('*', { count: 'exact', head: true }).eq('is_active', true),
  ])

  const now = new Date()
  const d30 = new Date(now); d30.setDate(d30.getDate() - 30)

  const activeThisMonth = (businesses ?? []).filter((b: { created_at: string; is_active: boolean }) =>
    b.is_active && new Date(b.created_at) >= d30
  ).length

  const totalRevenue = 0
  const mrr = 0

  const platformStats = {
    totalBusinesses: totalBusinesses ?? 0,
    activeThisMonth,
    activeTotal: activeCount ?? 0,
    totalRevenue,
    mrr,
    totalMessages: 0,
    totalContacts: 0,
  }

  return (
    <AdminView
      businesses={(businesses ?? []) as import('@/types/database').AdminBusiness[]}
      stats={platformStats}
    />
  )
}
