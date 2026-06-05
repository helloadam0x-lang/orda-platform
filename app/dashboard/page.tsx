import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import StatsRow from '@/components/dashboard/StatsRow'
import ActivityChart from '@/components/dashboard/ActivityChart'
import RecentConversations from '@/components/dashboard/RecentConversations'
import RecentOrders from '@/components/dashboard/RecentOrders'
import PlatformStatus from '@/components/dashboard/PlatformStatus'
import QuickActions from '@/components/dashboard/QuickActions'
import type { Business, Conversation, Order, DayActivity } from '@/types/database'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in')

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!business) redirect('/onboarding')

  const [
    contactsRes,
    convsRes,
    ordersRes,
    recentConvsRes,
    recentOrdersRes,
    paymentsRes,
  ] = await Promise.all([
    supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('business_id', business.id),
    supabase.from('conversations').select('*', { count: 'exact', head: true }).eq('business_id', business.id),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('business_id', business.id),
    supabase.from('conversations')
      .select('id, created_at, platform, status, is_ai_handling, last_message, unread_count, contact:contacts(name, platform)')
      .eq('business_id', business.id)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase.from('orders')
      .select('id, created_at, order_number, amount, status, contact:contacts(name)')
      .eq('business_id', business.id)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase.from('payments')
      .select('amount')
      .eq('business_id', business.id)
      .eq('status', 'completed'),
  ])

  const contactsCount = contactsRes.count ?? 0
  const conversationsCount = convsRes.count ?? 0
  const ordersCount = ordersRes.count ?? 0
  const recentConversations = (recentConvsRes.data ?? []) as unknown as Conversation[]
  const recentOrders = (recentOrdersRes.data ?? []) as unknown as Order[]
  const totalRevenue = (paymentsRes.data ?? []).reduce(
    (sum, p) => sum + ((p as { amount: number }).amount ?? 0),
    0
  )

  // Build 7-day activity skeleton (messages table may not exist yet)
  const activityData: DayActivity[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return { day: d.toLocaleDateString('en', { weekday: 'short' }), messages: 0 }
  })

  return (
    <div className="space-y-5 max-w-[1400px]">
      <StatsRow
        conversationsCount={conversationsCount}
        contactsCount={contactsCount}
        ordersCount={ordersCount}
        totalRevenue={totalRevenue}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ActivityChart data={activityData} />
        </div>
        <PlatformStatus business={business as Business} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <RecentConversations conversations={recentConversations} />
        </div>
        <QuickActions />
      </div>

      <RecentOrders orders={recentOrders} />
    </div>
  )
}
