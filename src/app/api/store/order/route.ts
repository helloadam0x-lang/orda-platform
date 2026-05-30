import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendPushToBusinessOwner } from '@/lib/push'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { contact_id, conversation_id, items, total, currency, notes } = body

    const { data: business } = await supabase
      .from('businesses').select('id, name').eq('user_id', user.id).single()
    if (!business) return NextResponse.json({ error: 'No business found' }, { status: 404 })

    const orderNumber = `ORD-${Date.now()}`
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        business_id: business.id,
        contact_id,
        conversation_id,
        order_number: orderNumber,
        items,
        total,
        currency: currency || 'USD',
        notes,
        status: 'pending',
        payment_status: 'unpaid',
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Push notification to business owner
    await sendPushToBusinessOwner(business.id, {
      title: `🛍️ New Order — ${orderNumber}`,
      body: `${currency || 'USD'} ${total} · ${items?.length || 0} item(s)`,
      tag: 'new-order',
      url: '/dashboard/orders',
      orderId: order.id,
      requireInteraction: true,
    })

    // WhatsApp notification via Express server (non-blocking)
    fetch(`${process.env.EXPRESS_URL}/whatsapp/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessId: business.id,
        message: `🛍️ *New Order Received!*\n\nOrder: ${orderNumber}\nAmount: ${currency || 'USD'} ${total}\n\n_Powered by Orda AI_`,
      }),
    }).catch(() => {})

    return NextResponse.json({ success: true, order })
  } catch (error: any) {
    console.error('Order creation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
