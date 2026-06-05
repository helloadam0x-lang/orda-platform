import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const period = Number(searchParams.get('period') ?? '30')

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: biz } = await supabase.from('businesses').select('id').eq('user_id', user.id).single()
  if (!biz) return NextResponse.json({ error: 'No business' }, { status: 404 })

  const { data } = await supabase.rpc('get_analytics_data', { p_business_id: biz.id, p_days: period })

  return NextResponse.json(data ?? {})
}
