import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const WEBHOOK_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/whatsapp-webhook`

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  try {
    const { accountSid, authToken, phoneNumber, businessId } = await req.json()

    if (!accountSid || !authToken || !phoneNumber || !businessId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const twilioAuth = Buffer.from(`${accountSid}:${authToken}`).toString('base64')

    // 1. Verify credentials
    const verifyRes = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}.json`,
      { headers: { Authorization: `Basic ${twilioAuth}` } }
    )
    if (!verifyRes.ok) {
      return NextResponse.json({ error: 'Invalid Twilio credentials' }, { status: 401 })
    }

    // 2. Set webhook URL on the phone number if it exists in the account
    const numbersRes = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/IncomingPhoneNumbers.json?PhoneNumber=${encodeURIComponent(phoneNumber)}`,
      { headers: { Authorization: `Basic ${twilioAuth}` } }
    )
    const numbersData = await numbersRes.json()
    if (numbersData.incoming_phone_numbers?.length > 0) {
      const numberSid = numbersData.incoming_phone_numbers[0].sid
      await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/IncomingPhoneNumbers/${numberSid}.json`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${twilioAuth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            SmsUrl: WEBHOOK_URL,
            StatusCallback: WEBHOOK_URL,
          }).toString(),
        }
      )
    }

    // 3. Save to Supabase
    const { error: dbError } = await supabase
      .from('businesses')
      .update({
        twilio_account_sid: accountSid,
        twilio_auth_token: authToken,
        twilio_phone_number: phoneNumber,
        whatsapp_connected: true,
        webhook_url: WEBHOOK_URL,
      })
      .eq('id', businessId)

    if (dbError) throw dbError

    return NextResponse.json({ success: true, webhookUrl: WEBHOOK_URL })
  } catch (error) {
    console.error('WhatsApp Connect Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
