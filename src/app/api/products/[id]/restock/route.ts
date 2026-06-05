import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: biz } = await supabase.from('businesses').select('id').eq('user_id', user.id).single()
  if (!biz) return NextResponse.json({ error: 'No business' }, { status: 404 })

  const { quantity } = await request.json()
  if (!quantity || quantity < 0) return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 })

  const { data: product } = await supabase.from('products').select('stock').eq('id', params.id).eq('business_id', biz.id).single()
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const newStock = (product.stock ?? 0) + quantity
  const { error } = await supabase.from('products').update({ stock: newStock }).eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ stock: newStock })
}
