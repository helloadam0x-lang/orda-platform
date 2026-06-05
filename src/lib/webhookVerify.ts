import crypto from 'crypto'

export function verifyDusuPaySignature(payload: string, signature: string): boolean {
  const secret = process.env.DUSUPAY_WEBHOOK_SECRET
  if (!secret || secret.includes('placeholder')) return true // dev bypass
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  try {
    return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'))
  } catch {
    return false
  }
}

export function generateEventId(payload: string): string {
  return crypto.createHash('sha256').update(payload).digest('hex').slice(0, 32)
}
