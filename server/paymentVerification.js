const fetch = require('node-fetch')
const { createClient } = require('@supabase/supabase-js')
const logger = require('./logger')

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
const GEMINI_KEY = process.env.GEMINI_API_KEY

async function verifyPaymentScreenshot(base64Data, orderId, businessId) {
  if (!GEMINI_KEY) {
    return { verified: false, flagged: false, message: 'Payment verification not configured.' }
  }

  try {
    const { data: order } = await supabase
      .from('orders')
      .select('order_number, total, currency')
      .eq('id', orderId)
      .single()

    if (!order) return { verified: false, message: 'Order not found.' }

    const prompt = `You are a payment verification AI. Analyze this mobile money or bank payment screenshot.

Order details:
- Order number: ${order.order_number}
- Expected amount: ${order.currency} ${order.total}

From the screenshot, extract:
1. Transaction status (SUCCESS/FAILED/PENDING)
2. Amount paid
3. Transaction ID or reference
4. Payment date/time
5. Sender name or number

Respond ONLY with valid JSON:
{
  "status": "SUCCESS" | "FAILED" | "PENDING" | "UNCLEAR",
  "amount": number or null,
  "currency": "UGX" or "USD" or null,
  "transaction_id": "string or null",
  "is_amount_correct": boolean,
  "is_suspicious": boolean,
  "suspicious_reason": "string or null"
}`

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { inline_data: { mime_type: 'image/jpeg', data: base64Data } },
              { text: prompt }
            ]
          }],
          generationConfig: { maxOutputTokens: 400, temperature: 0 }
        })
      }
    )

    const data = await res.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}'
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const result = JSON.parse(clean)

    logger.info('Payment verification result', { orderId, status: result.status, suspicious: result.is_suspicious })

    if (result.status === 'SUCCESS' && result.is_amount_correct && !result.is_suspicious) {
      // Auto-confirm payment
      await supabase.rpc('update_order_status', {
        p_order_id: orderId,
        p_business_id: businessId,
        p_status: 'confirmed',
        p_payment_status: 'paid',
      })

      await supabase.from('payment_verifications').insert({
        order_id: orderId,
        business_id: businessId,
        status: 'verified',
        transaction_id: result.transaction_id,
        amount: result.amount,
        verified_by: 'ai',
      })

      return {
        verified: true,
        flagged: false,
        transactionId: result.transaction_id,
        message: `✅ Payment verified! Transaction ${result.transaction_id ?? 'confirmed'}. Your order has been confirmed.`,
      }
    }

    if (result.is_suspicious) {
      await supabase.from('payment_verifications').insert({
        order_id: orderId,
        business_id: businessId,
        status: 'flagged',
        verified_by: 'ai',
        notes: result.suspicious_reason,
      })

      return {
        verified: false,
        flagged: true,
        reason: result.suspicious_reason,
        message: '⚠️ We could not verify this payment. Our team has been notified and will review it shortly.',
      }
    }

    return {
      verified: false,
      flagged: false,
      message: `We received your payment screenshot. Status: ${result.status ?? 'unclear'}. ${result.status !== 'SUCCESS' ? 'Please ensure the payment was successful and try again.' : 'Our team will verify shortly.'}`,
    }

  } catch (err) {
    logger.error('Payment verification error', { orderId, error: err.message })
    return {
      verified: false,
      flagged: false,
      message: 'We received your screenshot. Our team will verify your payment shortly.',
    }
  }
}

module.exports = { verifyPaymentScreenshot }
