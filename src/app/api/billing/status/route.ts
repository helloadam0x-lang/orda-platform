import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const ref = searchParams.get('ref')
  if (!ref) return NextResponse.json({ error: 'ref required' }, { status: 400 })

  const supabase = createClient()
  const { data } = await supabase
    .from('dusupay_transactions')
    .select('status, plan')
    .eq('id', ref)
    .single()

  return NextResponse.json({ status: data?.status ?? 'pending', plan: data?.plan })
}
