import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: business } = await supabase
    .from('businesses').select('id').eq('user_id', user.id).single()
  if (!business) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await fetch(`${process.env.EXPRESS_URL}/whatsapp/disconnect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ businessId: business.id }),
  })
  return NextResponse.json({ success: true })
}
