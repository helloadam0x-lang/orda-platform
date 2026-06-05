import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function sendCancellationEmail(to: string, name: string, expiryDate: string) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  if (!RESEND_API_KEY || RESEND_API_KEY.startsWith('re_placeholder')) return
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
    body: JSON.stringify({
      from: 'Orda <hello@getorda.app>',
      to,
      subject: 'Your Orda subscription has been cancelled',
      html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px">
        <h2 style="font-size:22px;font-weight:700;color:#111">Subscription Cancelled</h2>
        <p style="color:#555;line-height:1.6">Hi ${name},<br><br>
        Your Orda subscription has been cancelled. Your access continues until <strong>${expiryDate}</strong>.<br><br>
        We're sorry to see you go. You can resubscribe anytime from your dashboard.</p>
        <a href="https://getorda.app/dashboard/billing" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#D4A853;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">Resubscribe</a>
        <p style="margin-top:32px;color:#999;font-size:12px">Orda Technologies Ltd · Kampala, Uganda</p>
      </div>`,
    }),
  })
}

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { businessId } = await request.json()
  if (!businessId) return NextResponse.json({ error: 'businessId required' }, { status: 400 })

  const { data: biz } = await supabase
    .from('businesses')
    .select('id, name, plan, plan_expires_at')
    .eq('id', businessId)
    .eq('user_id', user.id)
    .single()

  if (!biz) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  if (biz.plan === 'trial') return NextResponse.json({ error: 'No active subscription to cancel' }, { status: 400 })

  // Mark as cancelled — access continues until expiry (FTC requirement)
  await supabase
    .from('businesses')
    .update({ plan: 'cancelled', cancellation_requested_at: new Date().toISOString() })
    .eq('id', businessId)

  // Send confirmation email immediately (FTC requirement)
  const expiryDate = biz.plan_expires_at
    ? new Date(biz.plan_expires_at).toLocaleDateString('en-UG', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'end of billing period'

  await sendCancellationEmail(user.email!, biz.name, expiryDate)

  return NextResponse.json({ cancelled: true, access_until: biz.plan_expires_at })
}
