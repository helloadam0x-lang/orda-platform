const GEMINI_API_KEY = process.env.GEMINI_API_KEY

const TONES = {
  professional: 'Clear, efficient, formal but warm.',
  friendly: 'Warm, conversational, approachable.',
  luxury: 'Refined, attentive, premium and elevated.',
}

async function generateReply(customerMessage, business, history = []) {
  const system = `You are the AI customer service agent for ${business.name}.
Tone: ${TONES[business.ai_personality] || TONES.friendly}
Currency: ${business.currency || 'USD'}

Rules:
- Reply in the SAME LANGUAGE the customer uses. Always.
- Keep replies under 3 sentences unless taking an order.
- For orders: confirm product name, quantity, ask for delivery address.
- For payment: say you will send a payment link shortly.
- NEVER say you are AI unless directly asked.
- If you cannot help: say "I'll get someone from our team shortly."
- End every reply with a clear next step for the customer.
- WhatsApp tone: conversational, not corporate.`

  const contents = [
    ...history.slice(-10).map(m => ({
      role: m.role === 'ai' || m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
    { role: 'user', parts: [{ text: customerMessage }] },
  ]

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents,
          generationConfig: { maxOutputTokens: 400, temperature: 0.75 },
        }),
      }
    )
    const data = await res.json()
    if (data.error) throw new Error(JSON.stringify(data.error))
    return data.candidates?.[0]?.content?.parts?.[0]?.text
      || 'Thank you! We will get back to you shortly.'
  } catch (err) {
    console.error('[Gemini Error]', err.message)
    return 'Thank you for your message. We will get back to you shortly.'
  }
}

module.exports = { generateReply }
