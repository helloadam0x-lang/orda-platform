'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { ShoppingBag, MessageSquare, TrendingUp, Clock, Wifi, WifiOff, ArrowRight } from 'lucide-react'
import { formatCurrency, timeAgo } from '@/lib/format'
import { getAvatarGradient } from '@/lib/format'

export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [business, setBusiness] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [recentConvos, setRecentConvos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/sign-in'); return }
      supabase.from('businesses').select('*').eq('user_id', user.id).single()
        .then(async ({ data: biz }) => {
          if (!biz) { router.push('/onboarding'); return }
          setBusiness(biz)

          const [statsRes, ordersRes, convosRes] = await Promise.all([
            supabase.rpc('get_order_stats', { p_business_id: biz.id }),
            supabase.from('orders').select('id, order_number, customer_name, total, status, created_at').eq('business_id', biz.id).order('created_at', { ascending: false }).limit(5),
            supabase.from('conversations').select('id, is_ai_handling, last_message, last_message_at, contacts(name, phone)').eq('business_id', biz.id).order('last_message_at', { ascending: false }).limit(5),
          ])

          setStats(statsRes.data)
          setRecentOrders(ordersRes.data ?? [])
          setRecentConvos(convosRes.data ?? [])
          setLoading(false)
        })
    })
  }, [])

  const currency = business?.currency ?? 'USD'

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="font-['Playfair_Display'] font-black text-2xl text-[var(--text-1)]">
          Dashboard
        </h1>
        {business && (
          <p className="text-[13px] text-[var(--text-3)] mt-1">
            Welcome back, <span style={{ color: 'var(--accent)' }}>{business.name}</span>
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Orders Today" value={loading ? null : stats?.total_today ?? 0} icon={<ShoppingBag size={16} />} loading={loading} />
        <StatsCard label="Revenue Today" value={loading ? null : formatCurrency(stats?.revenue_today ?? 0, currency)} icon={<TrendingUp size={16} />} loading={loading} accent />
        <StatsCard label="AI Messages" value={loading ? null : stats?.ai_messages_today ?? 0} icon={<MessageSquare size={16} />} loading={loading} />
        <StatsCard label="Pending Orders" value={loading ? null : stats?.pending ?? 0} icon={<Clock size={16} />} loading={loading} />
      </div>

      {/* WhatsApp status */}
      {!loading && business && (
        <div
          className="flex items-center justify-between px-5 py-4 rounded-[var(--r-xl)]"
          style={{
            background: business.is_whatsapp_connected ? 'rgba(34,197,94,0.06)' : 'var(--accent-dim)',
            border: `1px solid ${business.is_whatsapp_connected ? 'rgba(34,197,94,0.2)' : 'var(--accent-border)'}`,
          }}
        >
          <div className="flex items-center gap-3">
            {business.is_whatsapp_connected
              ? <Wifi size={18} style={{ color: 'var(--success)' }} />
              : <WifiOff size={18} style={{ color: 'var(--accent)' }} />}
            <div>
              <div className="text-[14px] font-semibold text-[var(--text-1)]">
                {business.is_whatsapp_connected ? 'AI Active — WhatsApp Connected' : 'Connect WhatsApp to activate AI'}
              </div>
              <div className="text-[12px] text-[var(--text-3)]">
                {business.is_whatsapp_connected
                  ? `${stats?.ai_messages_today ?? 0} messages handled today`
                  : 'Your AI will reply to every customer automatically'}
              </div>
            </div>
          </div>
          {!business.is_whatsapp_connected && (
            <button
              onClick={() => router.push('/dashboard/connect')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-[var(--r-md)] text-[13px] font-semibold transition-all duration-150"
              style={{ background: 'var(--accent)', color: 'var(--void)' }}
              onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)' }}
              onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
            >
              Connect <ArrowRight size={13} />
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent orders */}
        <div className="rounded-[var(--r-xl)] overflow-hidden" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="text-[14px] font-semibold text-[var(--text-1)]">Recent Orders</div>
            <button onClick={() => router.push('/dashboard/orders')} className="text-[12px]" style={{ color: 'var(--accent)' }}>View all →</button>
          </div>
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-14 skeleton mx-4 my-2 rounded" />)
            : recentOrders.length === 0
              ? <div className="px-5 py-8 text-center text-[13px] text-[var(--text-3)]">No orders yet</div>
              : recentOrders.map(o => (
                <div key={o.id} className="flex items-center gap-3 px-5 py-3 hover:bg-[var(--surface-3)] cursor-pointer transition-colors" style={{ borderBottom: '1px solid var(--border)' }} onClick={() => router.push('/dashboard/orders')}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-bold" style={{ color: 'var(--accent)' }}>{o.order_number}</span>
                      <span className="text-[12px] text-[var(--text-2)]">{o.customer_name}</span>
                    </div>
                    <div className="text-[11px] text-[var(--text-3)]">{timeAgo(o.created_at)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[13px] font-semibold text-[var(--text-1)]">{formatCurrency(o.total, currency)}</div>
                    <div className="text-[11px] capitalize text-[var(--text-3)]">{o.status?.replace('_', ' ')}</div>
                  </div>
                </div>
              ))}
        </div>

        {/* Recent conversations */}
        <div className="rounded-[var(--r-xl)] overflow-hidden" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="text-[14px] font-semibold text-[var(--text-1)]">Recent Conversations</div>
            <button onClick={() => router.push('/dashboard/conversations')} className="text-[12px]" style={{ color: 'var(--accent)' }}>View all →</button>
          </div>
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-14 skeleton mx-4 my-2 rounded" />)
            : recentConvos.length === 0
              ? <div className="px-5 py-8 text-center text-[13px] text-[var(--text-3)]">No conversations yet</div>
              : recentConvos.map((c: any) => (
                <div key={c.id} className="flex items-center gap-3 px-5 py-3 hover:bg-[var(--surface-3)] cursor-pointer transition-colors" style={{ borderBottom: '1px solid var(--border)' }} onClick={() => router.push('/dashboard/conversations')}>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                    style={{ background: getAvatarGradient(c.contacts?.name ?? '') }}
                  >
                    {(c.contacts?.name ?? '?').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-semibold text-[var(--text-1)]">{c.contacts?.name ?? 'Unknown'}</span>
                      <span className="text-[11px] text-[var(--text-3)]">{timeAgo(c.last_message_at)}</span>
                    </div>
                    <div className="text-[12px] text-[var(--text-2)] truncate">{c.last_message}</div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  )
}
