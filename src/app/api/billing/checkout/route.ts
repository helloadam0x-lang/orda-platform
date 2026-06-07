import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const DUSUPAY_PUBLIC_KEY = process.env.DUSUPAY_PUBLIC_KEY!
const DUSUPAY_SECRET_KEY = process.env.DUSUPAY_SECRET_KEY!
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://getorda.app'

const PLAN_AMOUNTS: Record<string, { usd: number; ugx: number }> = {
  starter: { usd: 19, ugx: 70000 },
  pro: { usd: 49, ugx: 180000 },
}

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { plan, paymentMethod, businessId } = await request.json()
  if (!PLAN_AMOUNTS[plan]) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

  const { data: biz } = await supabase.from('businesses').select('id, name, slug').eq('id', businessId).eq('user_id', user.id).single()
  if (!biz) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const amounts = PLAN_AMOUNTS[plan]
  const currency = paymentMethod === 'card' ? 'USD' : 'UGX'
  const amount = paymentMethod === 'card' ? amounts.usd : amounts.ugx

  // Create transaction record
  const { data: txn } = await supabase.from('dusupay_transactions').insert({
    business_id: businessId,
    plan,
    amount,
    currency,
    payment_method: paymentMethod,
    status: 'pending',
  }).select('id').single()

  // DusuPay not yet configured — extend trial 30 days
  if (!DUSUPAY_SECRET_KEY || DUSUPAY_SECRET_KEY.includes('placeholder') ||
      !DUSUPAY_PUBLIC_KEY || DUSUPAY_PUBLIC_KEY.includes('placeholder')) {
    const trialEnd = new Date()
    trialEnd.setDate(trialEnd.getDate() + 30)
    await supabase.from('businesses').update({
      plan: 'trial',
      plan_expires_at: trialEnd.toISOString(),
    }).eq('id', businessId).eq('user_id', user.id)
    return NextResponse.json({
      success: true,
      mode: 'trial_extended',
      message: 'Payment system activating soon. Your trial has been extended 30 days.',
      trialEnds: trialEnd.toISOString(),
    }, { headers: { 'Cache-Control': 'no-store' } })
  }

  try {
    const res = await fetch('https://api.dusupay.com/v1/collections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DUSUPAY_SECRET_KEY}`,
      },
      body: JSON.stringify({
        currency,
        amount,
        method: paymentMethod === 'card' ? 'CARD' : paymentMethod === 'mtn' ? 'MTN' : 'AIRTEL',
        provider_id: biz.slug,
        merchant_reference: txn?.id ?? businessId,
        redirect_url: `${APP_URL}/dashboard/billing?status=success`,
        webhook_url: `${APP_URL}/api/billing/webhook`,
        account_number: user.email,
        account_name: biz.name,
        description: `Orda ${plan} plan — ${biz.name}`,
      }),
    })
    const data = await res.json()
    if (data.payment_url) return NextResponse.json({ payment_url: data.payment_url })
  } catch {}

  return NextResponse.json({ error: 'Payment provider error' }, { status: 502 })
}
