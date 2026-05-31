import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: business } = await supabase
    .from('businesses').select('id, currency').eq('user_id', user.id).single()
  if (!business) return NextResponse.json({ error: 'No business' }, { status: 404 })

  const { searchParams } = new URL(req.url)
  const status  = searchParams.get('status')  || null
  const payment = searchParams.get('payment') || null
  const search  = searchParams.get('search')  || null

  const { data: orders } = await supabase.rpc('get_business_orders', {
    p_business_id:    business.id,
    p_status:         status,
    p_payment_status: payment,
    p_search:         search,
    p_limit:          50,
    p_offset:         0,
  })

  const { data: stats } = await supabase.rpc('get_order_stats', { p_business_id: business.id })

  return NextResponse.json({ orders: orders || [], stats, currency: business.currency })
}
