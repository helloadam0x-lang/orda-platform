import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { session_id, business_id, message, visitor_name } = await req.json()

    if (!session_id || !business_id || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()

    // Fetch business profile
    const { data: business, error: bizErr } = await supabase
      .from('businesses')
      .select('id, name, description, products, greeting, ai_instructions, country, email, phone, plan')
      .eq('id', business_id)
      .single()

    if (bizErr || !business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // Fetch last 10 messages for conversation history
    const { data: history } = await supabase
      .from('chat_messages')
      .select('role, content, is_ai')
      .eq('session_id', session_id)
      .order('created_at', { ascending: true })
      .limit(10)

    // Build system prompt
    const products = Array.isArray(business.products) ? business.products : []
    const systemPrompt = `You are an AI assistant for ${business.name}.
Business description: ${business.description ?? 'A business on Orda platform'}
Products and services: ${JSON.stringify(products)}
Country: ${business.country ?? 'Uganda'}
Special instructions: ${business.ai_instructions ?? 'Be helpful and professional'}

Your job:
- Reply helpfully to every customer question
- If asked about products, reply with accurate details from the products list only
- If customer wants to order, collect their name, what they want, quantity, and delivery address
- If customer wants to pay, tell them the total and say a payment link is being sent
- Detect the language the customer is writing in and reply in the same language
- Be warm, professional, and concise
- Never make up information not in the business profile
- If you cannot answer something, say you will connect them with the team
${visitor_name ? `- The customer's name is: ${visitor_name}` : ''}

When an order is ready to be created, respond with a JSON block at the very end of your message in this EXACT format (no spaces in the marker):
[ORDER:{"items":[{"name":"product name","quantity":1,"price":0}],"total":0,"delivery_address":"address"}]

When customer needs human help, add this at the very end:
[HANDOFF:true]`

    // Build conversation history for Gemini
    const conversationHistory = (history ?? []).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    // Call Gemini
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt,
    })

    const chat = model.startChat({ history: conversationHistory })
    const result = await chat.sendMessage(message)
    const rawResponse = result.response.text()

    // Parse ORDER marker
    let orderData: Record<string, unknown> | null = null
    let cleanResponse = rawResponse
    const orderMatch = rawResponse.match(/\[ORDER:([\s\S]*?)\](?!\[)/)
    if (orderMatch) {
      try {
        orderData = JSON.parse(orderMatch[1])
        cleanResponse = rawResponse.replace(orderMatch[0], '').trim()
      } catch {
        orderData = null
      }
    }

    // Parse HANDOFF marker
    const handoff = /\[HANDOFF:true\]/i.test(rawResponse)
    if (handoff) {
      cleanResponse = cleanResponse.replace(/\[HANDOFF:true\]/gi, '').trim()
    }

    // Save customer message
    await supabase.from('chat_messages').insert({
      session_id,
      business_id,
      role: 'user',
      content: message,
      is_ai: false,
    })

    // Save AI response
    await supabase.from('chat_messages').insert({
      session_id,
      business_id,
      role: 'assistant',
      content: cleanResponse,
      is_ai: true,
    })

    // Update session last_message_at
    await supabase
      .from('chat_sessions')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', session_id)

    // Handle ORDER creation
    let createdOrder: Record<string, unknown> | null = null
    if (orderData) {
      const { data: session } = await supabase
        .from('chat_sessions')
        .select('visitor_name, visitor_phone')
        .eq('id', session_id)
        .single()

      // Find or create a contact for this visitor
      let contactId: string | null = null
      if (session?.visitor_phone) {
        const { data: existing } = await supabase
          .from('contacts')
          .select('id')
          .eq('business_id', business_id)
          .eq('phone', session.visitor_phone)
          .single()
        if (existing) {
          contactId = existing.id
        } else {
          const { data: newContact } = await supabase
            .from('contacts')
            .insert({
              business_id,
              name: session.visitor_name ?? visitor_name ?? 'Web Customer',
              phone: session.visitor_phone,
              platform: 'web' as const,
            })
            .select('id')
            .single()
          contactId = newContact?.id ?? null
        }
      }

      if (contactId) {
        const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`
        const items = (orderData.items as Array<{ name: string; quantity: number; price: number }>) ?? []
        const { data: order } = await supabase
          .from('orders')
          .insert({
            business_id,
            contact_id: contactId,
            order_number: orderNumber,
            amount: (orderData.total as number) ?? 0,
            status: 'pending',
            items,
            delivery_address: (orderData.delivery_address as string) ?? null,
            payment_status: 'unpaid',
          })
          .select()
          .single()
        createdOrder = order
      }
    }

    // Handle HANDOFF — update session + email business owner
    if (handoff) {
      await supabase
        .from('chat_sessions')
        .update({ status: 'needs_human' })
        .eq('id', session_id)

      if (business.email) {
        try {
          await resend.emails.send({
            from: 'Orda <notifications@orda.app>',
            to: business.email,
            subject: `Customer needs help — ${business.name}`,
            html: `<p>A customer on your Orda web chat needs human assistance.</p>
<p><strong>Business:</strong> ${business.name}</p>
<p><strong>Customer:</strong> ${visitor_name ?? 'Anonymous'}</p>
<p><strong>Last message:</strong> ${message}</p>
<p>Log in to your Orda dashboard to respond.</p>`,
          })
        } catch {
          // Non-fatal
        }
      }
    }

    return NextResponse.json({
      response: cleanResponse,
      order: createdOrder,
      handoff,
    })
  } catch (err) {
    console.error('[chat/route] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
