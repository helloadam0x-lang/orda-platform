import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: business } = await supabase
    .from('businesses')
    .select('id, whatsapp_connected, whatsapp_phone')
    .eq('user_id', user.id)
    .single()

  if (!business) return NextResponse.json({ status: 'disconnected' })

  if (business.whatsapp_connected) {
    return NextResponse.json({ status: 'connected', phone: business.whatsapp_phone })
  }

  const res = await fetch(`${process.env.EXPRESS_URL}/whatsapp/status?businessId=${business.id}`)
  const data = await res.json()
  return NextResponse.json(data)
}
