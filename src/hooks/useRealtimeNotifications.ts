import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { playOrderSound, playMessageSound, flashTabTitle } from '@/lib/sounds'

export function useRealtimeNotifications(
  businessId: string | undefined,
  onNewOrder?: (order: any) => void,
  onNewMessage?: (msg: any) => void
) {
  const supabase = createClient()

  useEffect(() => {
    if (!businessId) return

    const ordersChannel = supabase
      .channel('new-orders')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'orders',
        filter: `business_id=eq.${businessId}`,
      }, async (payload) => {
        const { data } = await supabase
          .from('businesses').select('notify_sound').eq('id', businessId).single()
        if (data?.notify_sound) playOrderSound()
        flashTabTitle('New Order!')
        if (onNewOrder) onNewOrder(payload.new)
      })
      .subscribe()

    const messagesChannel = supabase
      .channel('new-messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `business_id=eq.${businessId}`,
      }, async (payload) => {
        if (!payload.new.is_ai) {
          const { data } = await supabase
            .from('businesses').select('notify_sound').eq('id', businessId).single()
          if (data?.notify_sound) playMessageSound()
          if (onNewMessage) onNewMessage(payload.new)
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(ordersChannel)
      supabase.removeChannel(messagesChannel)
    }
  }, [businessId])
}
