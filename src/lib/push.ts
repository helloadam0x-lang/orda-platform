import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'

webpush.setVapidDetails(
  process.env.VAPID_EMAIL || 'mailto:hello@getorda.app',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function sendPushToBusinessOwner(
  businessId: string,
  notification: {
    title: string
    body: string
    url?: string
    tag?: string
    orderId?: string
    requireInteraction?: boolean
  }
) {
  const { data: subs, error } = await supabase.rpc('get_push_subscriptions', {
    p_business_id: businessId,
  })
  if (error || !subs || subs.length === 0) return

  const payload = JSON.stringify({
    ...notification,
    url: notification.url || '/dashboard',
    actions: [{ action: 'view', title: 'View Dashboard' }],
  })

  await Promise.allSettled(
    subs.map((sub: { endpoint: string; p256dh: string; auth: string }) =>
      webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload
      ).catch(async (err: any) => {
        if (err.statusCode === 410 || err.statusCode === 404) {
          await supabase.rpc('deactivate_push_endpoint', { p_endpoint: sub.endpoint })
        }
      })
    )
  )
}
