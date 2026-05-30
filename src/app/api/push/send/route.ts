import { NextRequest, NextResponse } from 'next/server'
import { sendPushToBusinessOwner } from '@/lib/push'

export async function POST(req: NextRequest) {
  try {
    const { businessId, title, body, tag, url, orderId, requireInteraction } = await req.json()
    if (!businessId || !title || !body) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    await sendPushToBusinessOwner(businessId, { title, body, tag, url, orderId, requireInteraction })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Push send error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
