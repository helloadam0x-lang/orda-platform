import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  try {
    const { businessId } = await req.json()

    const { data: business, error } = await supabase
      .from('businesses')
      .select('twilio_account_sid, twilio_auth_token, twilio_phone_number')
      .eq('id', businessId)
      .single()

    if (error || !business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    const { twilio_account_sid, twilio_auth_token, twilio_phone_number } = business
    const twilioAuth = Buffer.from(`${twilio_account_sid}:${twilio_auth_token}`).toString('base64')

    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilio_account_sid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${twilioAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: `whatsapp:${twilio_phone_number}`,
          From: `whatsapp:${twilio_phone_number}`,
          Body: '✅ Orda AI is connected. Your AI agent is now live and ready to reply to customers. Reply with anything to test it.',
        }).toString(),
      }
    )

    if (!res.ok) {
      const err = await res.json()
      return NextResponse.json({ error: err.message || 'Failed to send test message' }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: 'Test message sent' })
  } catch (error) {
    console.error('WhatsApp Test Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
