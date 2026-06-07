import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const start = Date.now()
  const checks: Record<string, string> = {}

  // Supabase
  try {
    const supabase = createClient()
    const { error } = await supabase.from('businesses').select('id').limit(1)
    checks.supabase = error ? 'error: ' + error.message : 'ok'
  } catch (e: any) {
    checks.supabase = 'error: ' + e.message
  }

  // Redis (optional — skip if not configured)
  if (process.env.UPSTASH_REDIS_REST_URL) {
    try {
      const { Redis } = await import('@upstash/redis')
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      })
      await redis.ping()
      checks.redis = 'ok'
    } catch (e: any) {
      checks.redis = 'error: ' + e.message
    }
  }

  const allOk = Object.values(checks).every(v => v === 'ok')

  return NextResponse.json({
    status: allOk ? 'healthy' : 'degraded',
    checks,
    latency: Date.now() - start + 'ms',
    timestamp: new Date().toISOString(),
  }, {
    status: allOk ? 200 : 207,
    headers: { 'Cache-Control': 'no-store' },
  })
}
