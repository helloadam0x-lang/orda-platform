import { createClient } from '@/lib/supabase/server'

export async function withIdempotency<T>(
  key: string,
  userId: string,
  path: string,
  handler: () => Promise<{ status: number; body: T }>
): Promise<{ status: number; body: T; cached: boolean }> {
  const supabase = createClient()

  // Check for existing completed key
  const { data: existing } = await supabase
    .from('idempotency_keys')
    .select('response_status, response_body, completed')
    .eq('key', key)
    .eq('user_id', userId)
    .gte('expires_at', new Date().toISOString())
    .single()

  if (existing?.completed) {
    return {
      status: existing.response_status as number,
      body: existing.response_body as T,
      cached: true,
    }
  }

  // Register key before executing
  await supabase.from('idempotency_keys').upsert(
    {
      key,
      user_id: userId,
      request_path: path,
      completed: false,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
    { onConflict: 'key' }
  )

  const result = await handler()

  // Mark completed with response
  await supabase
    .from('idempotency_keys')
    .update({
      response_status: result.status,
      response_body: result.body as object,
      completed: true,
    })
    .eq('key', key)

  return { ...result, cached: false }
}
