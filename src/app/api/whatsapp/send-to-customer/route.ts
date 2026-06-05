import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { businessId, customerPhone, message } = body

  if (!businessId || !customerPhone || !message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const { data: biz } = await supabase.from('businesses').select('id').eq('user_id', user.id).eq('id', businessId).single()
  if (!biz) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const expressUrl = process.env.EXPRESS_URL ?? 'http://localhost:3001'
  const res = await fetch(`${expressUrl}/whatsapp/send-to-customer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ businessId, customerPhone, message }),
  }).catch(() => null)

  if (!res?.ok) return NextResponse.json({ error: 'Failed to send' }, { status: 502 })

  // Save owner message to DB
  const { data: contact } = await supabase.from('contacts').select('id').eq('business_id', businessId).eq('phone', customerPhone).single()
  if (contact) {
    const { data: conv } = await supabase.from('conversations').select('id').eq('business_id', businessId).eq('contact_id', contact.id).single()
    if (conv) {
      await supabase.rpc('save_whatsapp_message', {
        p_conversation_id: conv.id, p_business_id: businessId,
        p_content: message, p_role: 'owner', p_is_ai: false,
      })
    }
  }

  return NextResponse.json({ ok: true })
}
