import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient()
  const { error } = await supabase.rpc('refresh_analytics_views')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ refreshed: true, timestamp: new Date().toISOString() })
}
