'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Crown, ArrowLeft, MessageSquare, ShoppingBag, Star } from 'lucide-react'
import { getAvatarGradient, formatCurrency, timeAgo } from '@/lib/format'

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = createClient()
  const [contact, setContact] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [currency, setCurrency] = useState('USD')
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'orders' | 'conversations'>('orders')
  const [notes, setNotes] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/sign-in'); return }
      supabase.from('businesses').select('currency').eq('user_id', user.id).single()
        .then(({ data: biz }) => { if (biz) setCurrency(biz.currency ?? 'USD') })
    })
    supabase.from('contacts').select('*').eq('id', id).single()
      .then(({ data }) => { if (data) { setContact(data); setNotes(data.notes ?? '') }; setLoading(false) })
    supabase.from('orders').select('id, order_number, total, status, payment_status, created_at')
      .eq('contact_id', id).order('created_at', { ascending: false }).limit(20)
      .then(({ data }) => setOrders(data ?? []))
  }, [id])

  async function saveNotes() {
    setSavingNotes(true)
    await supabase.from('contacts').update({ notes }).eq('id', id)
    setSavingNotes(false)
  }

  async function toggleVIP() {
    const next = !contact.is_vip
    await supabase.from('contacts').update({ is_vip: next }).eq('id', id)
    setContact((c: any) => ({ ...c, is_vip: next }))
  }

  if (loading) return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <div className="h-32 skeleton rounded-[var(--r-lg)]" />
      <div className="h-64 skeleton rounded-[var(--r-lg)]" />
    </div>
  )

  if (!contact) return <div className="p-6 text-[var(--text-3)] text-[13px]">Contact not found.</div>

  const statusColor: Record<string, string> = {
    delivered: 'var(--success)', cancelled: 'var(--error)',
    out_for_delivery: 'var(--accent)', default: 'var(--text-2)',
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-5">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-[13px] text-[var(--text-3)] hover:text-[var(--text-1)]">
        <ArrowLeft size={14} /> Back
      </button>

      {/* Hero */}
      <div className="rounded-[var(--r-xl)] p-6" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
        <div className="flex items-start gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white shrink-0"
            style={{ background: getAvatarGradient(contact.name ?? '') }}
          >
            {(contact.name ?? '?').slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-['Playfair_Display'] font-black text-xl text-[var(--text-1)]">{contact.name ?? 'Unknown'}</h1>
              {contact.is_vip && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
                  VIP
                </span>
              )}
            </div>
            <div className="text-[13px] text-[var(--text-3)] mt-0.5">{contact.phone}</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              {[
                { label: 'Orders', value: contact.order_count ?? 0, icon: <ShoppingBag size={14} /> },
                { label: 'Spent', value: formatCurrency(contact.total_spent ?? 0, currency), icon: <Star size={14} /> },
                { label: 'Last Active', value: contact.last_active_at ? timeAgo(contact.last_active_at) : '—', icon: <MessageSquare size={14} /> },
                { label: 'Loyalty Pts', value: contact.loyalty_points ?? 0, icon: <Crown size={14} /> },
              ].map(s => (
                <div key={s.label}>
                  <div className="flex items-center gap-1 text-[11px] text-[var(--text-3)] uppercase tracking-wide mb-1">
                    {s.icon} {s.label}
                  </div>
                  <div className="text-[15px] font-semibold text-[var(--text-1)]">{s.value}</div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={toggleVIP}
            className="p-2 rounded-[var(--r-md)] transition-colors duration-150"
            style={{ background: contact.is_vip ? 'var(--accent-dim)' : 'var(--surface-3)', color: contact.is_vip ? 'var(--accent)' : 'var(--text-3)' }}
          >
            <Crown size={16} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-[var(--r-md)] w-fit" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
        {(['orders', 'conversations'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-1.5 rounded-[var(--r-sm)] text-[13px] font-medium capitalize transition-colors duration-150"
            style={{ background: tab === t ? 'var(--accent)' : 'transparent', color: tab === t ? 'var(--void)' : 'var(--text-2)' }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'orders' && (
        <div className="rounded-[var(--r-lg)] overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          {orders.length === 0 ? (
            <div className="py-10 text-center text-[var(--text-3)] text-[13px]">No orders yet</div>
          ) : orders.map(o => (
            <div key={o.id} className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <div>
                <div className="text-[13px] font-semibold" style={{ color: 'var(--accent)' }}>{o.order_number}</div>
                <div className="text-[11px] text-[var(--text-3)]">{timeAgo(o.created_at)}</div>
              </div>
              <div className="text-right">
                <div className="text-[13px] font-semibold text-[var(--text-1)]">{formatCurrency(o.total, currency)}</div>
                <div className="text-[11px] capitalize" style={{ color: statusColor[o.status] ?? statusColor.default }}>{o.status?.replace('_', ' ')}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Notes */}
      <div className="rounded-[var(--r-lg)] p-5" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
        <div className="text-[13px] font-semibold text-[var(--text-1)] mb-3">Notes</div>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          onBlur={saveNotes}
          rows={4}
          placeholder="Add notes about this customer…"
          className="w-full bg-[var(--surface-3)] rounded-[var(--r-md)] px-3 py-2.5 text-[13px] text-[var(--text-1)] placeholder:text-[var(--text-3)] outline-none resize-none"
          style={{ border: '1px solid var(--border)' }}
        />
        <button
          onClick={saveNotes}
          disabled={savingNotes}
          className="mt-2 px-4 py-1.5 rounded-[var(--r-md)] text-[12px] font-medium transition-all duration-150 disabled:opacity-50"
          style={{ background: 'var(--accent)', color: 'var(--void)' }}
        >
          {savingNotes ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  )
}
