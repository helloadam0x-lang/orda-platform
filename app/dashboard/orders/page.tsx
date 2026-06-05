import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import OrdersView from '@/components/dashboard/OrdersView'
import type { Order } from '@/types/database'

export default async function OrdersPage() {
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
    { data: orders },
    { count: total },
    { count: pending },
    { count: delivered },
  ] = await Promise.all([
    supabase
      .from('orders')
      .select('id, created_at, order_number, amount, status, payment_status, driver, items, delivery_address, delivery_fee, payment_method, notes, contact:contacts(name, phone, platform)')
      .eq('business_id', id)
      .order('created_at', { ascending: false }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('business_id', id),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('business_id', id).eq('status', 'pending'),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('business_id', id).eq('status', 'delivered'),
  ])

  const revenue = (orders ?? []).filter(o => o.status === 'delivered').reduce((sum, o) => sum + (o.amount ?? 0), 0)

  return (
    <OrdersView
      orders={(orders ?? []) as unknown as Order[]}
      stats={{ total: total ?? 0, pending: pending ?? 0, delivered: delivered ?? 0, revenue }}
      businessId={id}
    />
  )
}
