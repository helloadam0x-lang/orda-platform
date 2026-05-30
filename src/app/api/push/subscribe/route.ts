import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { subscription } = await req.json()
    const { data: business, error: bizError } = await supabase
      .from('businesses').select('id').eq('user_id', user.id).single()
    if (bizError || !business) return NextResponse.json({ error: 'No business found' }, { status: 404 })

    const { endpoint, keys: { p256dh, auth } } = subscription
    const { error: upsertError } = await supabase.from('push_subscriptions').upsert({
      business_id: business.id,
      user_id: user.id,
      endpoint,
      p256dh,
      auth,
      user_agent: req.headers.get('user-agent') || '',
      is_active: true,
    }, { onConflict: 'endpoint' })
    if (upsertError) throw upsertError

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Push subscribe error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
