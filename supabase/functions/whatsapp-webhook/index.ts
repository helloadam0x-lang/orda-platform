import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')!

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function sendWhatsAppReply(
  to: string, from: string, body: string,
  accountSid: string, authToken: string
) {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`
  const credentials = btoa(`${accountSid}:${authToken}`)
  await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ To: to, From: from, Body: body }).toString(),
  })
}

async function generateAIReply(
  customerMessage: string,
  business: { name: string; ai_personality: string; currency: string },
  history: { role: string; content: string }[]
): Promise<string> {
  const personalities: Record<string, string> = {
    professional: 'Clear, efficient, and business-like. Use formal language.',
    friendly: 'Warm, conversational, and approachable. Use friendly language.',
    luxury: 'Refined, attentive, and elevated. Use premium language.',
  }

  const system = `You are the AI customer service agent for ${business.name}.
Tone: ${personalities[business.ai_personality] ?? personalities.professional}
Currency: ${business.currency}

Core rules:
- Reply in the SAME LANGUAGE the customer uses
- Keep replies under 3 sentences unless taking an order
- If customer wants to order: confirm product name, quantity, and ask for delivery address
- If asked about payment: say you will send a payment link
- Never reveal you are an AI unless directly asked
- If you cannot help: say "I will get someone from our team to assist you shortly"
- Always end with a clear next step for the customer`

  const messages = [
    ...history.slice(-8).map(m => ({
      role: m.role === 'ai' || m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    })),
    { role: 'user' as const, content: customerMessage },
  ]

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 400,
      system,
      messages,
    }),
  })

  const data = await res.json()
  return data.content?.[0]?.text
    ?? 'Thank you for your message. We will get back to you shortly.'
}

Deno.serve(async (req: Request) => {
  if (req.method === 'GET') {
    return new Response(
      JSON.stringify({ status: 'Orda AI Webhook — Live' }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const form = await req.formData()
    const rawFrom = form.get('From')?.toString() ?? ''
    const rawTo   = form.get('To')?.toString() ?? ''
    const body    = form.get('Body')?.toString() ?? ''
    const profileName = form.get('ProfileName')?.toString() ?? ''

    if (!rawFrom || !body) {
      return new Response('Bad request', { status: 400 })
    }

    const customerPhone = rawFrom.replace('whatsapp:', '')
    const businessWhatsAppNumber = rawTo.replace('whatsapp:', '')

    const { data: business } = await supabase
      .from('businesses')
      .select('id, name, ai_personality, auto_reply, currency, twilio_account_sid, twilio_auth_token, twilio_phone_number')
      .eq('twilio_phone_number', businessWhatsAppNumber)
      .eq('whatsapp_connected', true)
      .single()

    if (!business) return new Response('', { status: 200 })
    if (!business.auto_reply) return new Response('', { status: 200 })

    let { data: contact } = await supabase
      .from('contacts')
      .select('id, name')
      .eq('business_id', business.id)
      .eq('phone', customerPhone)
      .maybeSingle()

    if (!contact) {
      const { data: newContact } = await supabase
        .from('contacts')
        .insert({
          business_id: business.id,
          phone: customerPhone,
          name: profileName || customerPhone,
          platform: 'whatsapp',
          last_message_at: new Date().toISOString(),
        })
        .select('id, name')
        .single()
      contact = newContact
    } else {
      await supabase.from('contacts').update({ last_message_at: new Date().toISOString() }).eq('id', contact.id)
    }

    if (!contact) throw new Error('Contact creation failed')

    let { data: conversation } = await supabase
      .from('conversations')
      .select('id, unread_count')
      .eq('business_id', business.id)
      .eq('contact_id', contact.id)
      .eq('status', 'open')
      .maybeSingle()

    if (!conversation) {
      const { data: newConv } = await supabase
        .from('conversations')
        .insert({
          business_id: business.id,
          contact_id: contact.id,
          platform: 'whatsapp',
          status: 'open',
          last_message: body,
          last_message_at: new Date().toISOString(),
          unread_count: 1,
          is_ai_handling: true,
        })
        .select('id, unread_count')
        .single()
      conversation = newConv
    } else {
      await supabase
        .from('conversations')
        .update({
          last_message: body,
          last_message_at: new Date().toISOString(),
          unread_count: (conversation.unread_count ?? 0) + 1,
        })
        .eq('id', conversation.id)
    }

    if (!conversation) throw new Error('Conversation creation failed')

    await supabase.from('messages').insert({
      conversation_id: conversation.id,
      business_id: business.id,
      content: body,
      role: 'customer',
      platform: 'whatsapp',
      is_ai: false,
      read: false,
    })

    const { data: history } = await supabase
      .from('messages')
      .select('role, content')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true })
      .limit(16)

    const aiReply = await generateAIReply(body, business, history ?? [])

    await supabase.from('messages').insert({
      conversation_id: conversation.id,
      business_id: business.id,
      content: aiReply,
      role: 'ai',
      platform: 'whatsapp',
      is_ai: true,
      read: true,
    })

    await supabase.from('notifications').insert({
      business_id: business.id,
      type: 'message',
      title: `New message from ${contact.name}`,
      message: body.substring(0, 80),
      read: false,
      data: { conversation_id: conversation.id, contact_id: contact.id },
    })

    await supabase.from('conversations').update({ last_message: aiReply }).eq('id', conversation.id)

    await sendWhatsAppReply(
      `whatsapp:${customerPhone}`,
      `whatsapp:${businessWhatsAppNumber}`,
      aiReply,
      business.twilio_account_sid,
      business.twilio_auth_token
    )

    await supabase.rpc('increment_message_count', { row_id: business.id })

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    console.error('Webhook error:', err)
    return new Response(JSON.stringify({ error: String(err) }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
