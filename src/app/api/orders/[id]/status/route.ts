import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const STATUS_MESSAGES: Record<string, (name: string, reason?: string) => string> = {
  confirmed:        (name) => `✅ *Order Confirmed!*\n\nHi ${name}! Your order has been confirmed and is being prepared.\n\n_Powered by Orda AI_`,
  packed:           (name) => `📦 *Order Packed!*\n\nHi ${name}! Your order is packed and ready for dispatch.\n\n_Powered by Orda AI_`,
  out_for_delivery: (name) => `🚴 *Out for Delivery!*\n\nHi ${name}! Your order is on its way to you now.\n\n_Powered by Orda AI_`,
  delivered:        (name) => `✅ *Delivered!*\n\nHi ${name}! Your order has arrived. Thank you for shopping with us! 🙏\n\n_Powered by Orda AI_`,
  cancelled:        (name, reason) => `❌ *Order Cancelled*\n\nHi ${name}, unfortunately your order has been cancelled.\nReason: ${reason || 'N/A'}\n\nPlease contact us if you have questions.\n\n_Powered by Orda AI_`,
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: business } = await supabase
    .from('businesses').select('id').eq('user_id', user.id).single()
  if (!business) return NextResponse.json({ error: 'No business' }, { status: 404 })

  const {
    status, paymentStatus, deliveryStatus, notes, cancellationReason,
    sendWhatsApp, customerPhone, customerName,
  } = await req.json()

  const { data: order, error } = await supabase.rpc('update_order_status', {
    p_order_id:            params.id,
    p_business_id:         business.id,
    p_status:              status,
    p_payment_status:      paymentStatus      || null,
    p_delivery_status:     deliveryStatus     || null,
    p_notes:               notes              || null,
    p_cancellation_reason: cancellationReason || null,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (sendWhatsApp && customerPhone && STATUS_MESSAGES[status]) {
    const message = STATUS_MESSAGES[status](customerName || 'Customer', cancellationReason)
    fetch(`${process.env.EXPRESS_URL}/whatsapp/send-to-customer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessId: business.id, customerPhone, message }),
      signal: AbortSignal.timeout(5000),
    }).catch(() => {})
  }

  return NextResponse.json({ success: true, order })
}
