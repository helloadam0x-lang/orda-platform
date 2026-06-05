import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendPushToBusinessOwner } from '@/lib/push'
import { storeOrderSchema } from '@/lib/validation'
import { checkLimit } from '@/lib/ratelimit'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  const { success: rateLimitOk } = await checkLimit('api_orders', ip)
  if (!rateLimitOk) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  // Idempotency key — prevent duplicate orders on network retry
  const idempotencyKey = req.headers.get('Idempotency-Key')
  const supabase = createClient()

  if (idempotencyKey) {
    const { data: existing } = await supabase
      .from('idempotency_keys')
      .select('response_body, completed')
      .eq('key', idempotencyKey)
      .eq('completed', true)
      .gte('expires_at', new Date().toISOString())
      .single()

    if (existing?.completed) {
      return NextResponse.json(existing.response_body as object, {
        headers: { 'X-Idempotency-Cached': 'true' },
      })
    }

    // Register key
    await supabase.from('idempotency_keys').upsert({
      key: idempotencyKey,
      user_id: 'store-public',
      request_path: '/api/store/order',
      completed: false,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }, { onConflict: 'key' })
  }

  try {
    const body = await req.json()
    const parsed = storeOrderSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 })
    }

    const { slug, name, phone, items, total, address, zone } = parsed.data

    const { data: result } = await supabase
      .rpc('create_store_order', {
        p_business_id: null, // RPC resolves from slug
        p_slug: slug,
        p_customer_name: name,
        p_phone: phone,
        p_items: items,
        p_total: total,
        p_address: address ?? null,
        p_zone: zone ?? null,
      })

    if (!result) {
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    const orderId = (result as any).order_id
    const orderNumber = (result as any).order_number
    const businessId = (result as any).business_id

    // Push notification
    if (businessId) {
      await sendPushToBusinessOwner(businessId, {
        title: `🛍️ New Order — ${orderNumber}`,
        body: `${name} · ${items.length} item(s)`,
        tag: 'new-order',
        url: '/dashboard/orders',
        requireInteraction: true,
      })

      fetch(`${process.env.EXPRESS_URL ?? 'http://localhost:3001'}/whatsapp/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId, message: `🛍️ *New Store Order!*\n\nOrder: ${orderNumber}\nCustomer: ${name}\nTotal: ${total}\n\nView in dashboard.` }),
        signal: AbortSignal.timeout(5000),
      }).catch(() => {})
    }

    const responseBody = { orderId, orderNumber }

    // Mark idempotency key as completed
    if (idempotencyKey) {
      await supabase.from('idempotency_keys').update({
        response_status: 201,
        response_body: responseBody,
        completed: true,
      }).eq('key', idempotencyKey)
    }

    return NextResponse.json(responseBody, { status: 201 })
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}
