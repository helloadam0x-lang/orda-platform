import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

function makeRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || url.includes('placeholder') || !token || token.includes('placeholder')) return null
  return new Redis({ url, token })
}

function makeLimit(redis: Redis, window: `${number} s` | `${number} m` | `${number} h` | `${number} d`, requests: number, prefix: string) {
  return new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(requests, window), prefix })
}

let _limits: ReturnType<typeof buildLimits> | null = null

function buildLimits() {
  const redis = makeRedis()
  if (!redis) return null
  return {
    auth_signup:     makeLimit(redis, '1 h',  3,      'orda:auth:signup'),
    auth_login:      makeLimit(redis, '15 m', 10,     'orda:auth:login'),
    auth_reset:      makeLimit(redis, '1 h',  3,      'orda:auth:reset'),
    auth_magic:      makeLimit(redis, '1 h',  5,      'orda:auth:magic'),
    ai_chat:         makeLimit(redis, '1 m',  20,     'orda:ai:chat'),
    ai_generate:     makeLimit(redis, '1 h',  5,      'orda:ai:generate'),
    ai_vision:       makeLimit(redis, '1 h',  10,     'orda:ai:vision'),
    api_general:     makeLimit(redis, '1 m',  100,    'orda:api'),
    api_orders:      makeLimit(redis, '1 m',  30,     'orda:orders'),
    api_broadcast:   makeLimit(redis, '1 h',  3,      'orda:broadcast'),
  }
}

function getLimits() {
  if (!_limits) _limits = buildLimits()
  return _limits
}

export type LimitKey = keyof NonNullable<ReturnType<typeof buildLimits>>

export async function checkLimit(
  limiterKey: LimitKey,
  identifier: string
): Promise<{ success: boolean; remaining: number; reset: number }> {
  const limits = getLimits()
  if (!limits) return { success: true, remaining: 999, reset: 0 }
  const result = await limits[limiterKey].limit(identifier)
  return { success: result.success, remaining: result.remaining, reset: result.reset }
}

// Backward-compatible simple check
export async function checkRateLimit(identifier: string): Promise<{ success: boolean; reset?: number }> {
  return checkLimit('api_general', identifier)
}

export function rateLimitHeaders(remaining: number, reset: number) {
  return {
    'X-RateLimit-Remaining': String(remaining),
    'X-RateLimit-Reset': String(reset),
    'Retry-After': String(Math.max(0, Math.ceil((reset - Date.now()) / 1000))),
  }
}
