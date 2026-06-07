import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header } from '@/components/dashboard/Header'
import { DashboardShell } from '@/components/dashboard/DashboardShell'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in')

  const { data: business } = await supabase
    .from('businesses')
    .select('id, plan, plan_expires_at')
    .eq('user_id', user.id)
    .single()

  if (!business) redirect('/onboarding')

  const isTrialExpired = business.plan === 'trial' &&
    business.plan_expires_at &&
    new Date(business.plan_expires_at) < new Date()

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Owner'
  const userEmail = user.email ?? ''

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--void)' }}>
      {/* Trial expiry banner */}
      {isTrialExpired && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
          background: '#F59E0B', color: '#050505',
          padding: '9px 24px', textAlign: 'center',
          fontSize: 13, fontWeight: 600,
        }}>
          Your trial has ended. Upgrade to keep your AI active.{' '}
          <a href="/dashboard/billing" style={{ textDecoration: 'underline', color: '#050505' }}>
            View Plans →
          </a>
        </div>
      )}
      {/* Desktop sidebar */}
      <div className="hidden md:flex h-full" style={{ marginTop: isTrialExpired ? 38 : 0 }}>
        <Sidebar userName={userName} userEmail={userEmail} plan={business.plan} />
      </div>

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden" style={{ marginTop: isTrialExpired ? 38 : 0 }}>
        {/* Mobile header */}
        <Header title="Dashboard" userName={userName} userEmail={userEmail} plan={business.plan} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <DashboardShell businessId={business.id}>
            {children}
          </DashboardShell>
        </main>
      </div>
    </div>
  )
}
