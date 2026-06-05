import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: biz } = await supabase.from('businesses').select('id').eq('user_id', user.id).single()
  if (!biz) return NextResponse.json({ error: 'No business' }, { status: 404 })

  const { data: conv } = await supabase.from('conversations').select('is_ai_handling').eq('id', params.id).eq('business_id', biz.id).single()
  if (!conv) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { error } = await supabase.from('conversations').update({ is_ai_handling: !conv.is_ai_handling }).eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ is_ai_handling: !conv.is_ai_handling })
}
