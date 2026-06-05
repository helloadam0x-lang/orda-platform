import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyDusuPaySignature, generateEventId } from '@/lib/webhookVerify'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('x-dusupay-signature') ?? ''

  if (!verifyDusuPaySignature(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const payload = JSON.parse(body)
  const supabase = createClient()

  // Deduplication — prevent replay attacks
  const eventId = request.headers.get('x-webhook-event-id') ?? generateEventId(body)
  const { data: existing } = await supabase
    .from('webhook_events')
    .select('id')
    .eq('event_id', eventId)
    .single()

  if (existing) {
    return NextResponse.json({ received: true, duplicate: true })
  }

  // Record event before processing
  await supabase.from('webhook_events').insert({
    source: 'dusupay',
    event_type: payload.event ?? 'payment',
    event_id: eventId,
    payload,
  })

  // Process payment
  const { merchant_reference, status, amount, currency } = payload

  await supabase.rpc('process_dusupay_webhook', {
    p_reference: merchant_reference,
    p_status: status,
    p_amount: amount,
    p_currency: currency,
    p_business_id: null,
    p_plan: null,
  })

  // Update transaction record
  if (merchant_reference) {
    await supabase
      .from('dusupay_transactions')
      .update({ status: status?.toLowerCase() ?? 'unknown' })
      .eq('id', merchant_reference)
  }

  return NextResponse.json({ received: true })
}
