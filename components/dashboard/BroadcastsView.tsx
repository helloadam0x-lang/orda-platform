'use client'

import { useState } from 'react'
import { Plus, MoreHorizontal, Send, Radio, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { Broadcast, BroadcastStatus } from '@/types/database'

function timeAgo(ts: string) {
  try {
    const diff = Date.now() - new Date(ts).getTime()
    if (diff < 60000) return 'just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`
    return new Date(ts).toLocaleDateString('en', { month: 'short', day: 'numeric' })
  } catch { return ts }
}

const STATUS_STYLES: Record<BroadcastStatus, { bg: string; text: string }> = {
  draft:     { bg: '#8892A420', text: '#8892A4' },
  scheduled: { bg: '#1877F220', text: '#1877F2' },
  sending:   { bg: '#F0A50020', text: '#F0A500' },
  sent:      { bg: '#00D97E20', text: '#00D97E' },
  failed:    { bg: '#ef444420', text: '#ef4444' },
}

interface Stats {
  totalSent: number
  totalDelivered: number
  avgOpenRate: number
  totalReached: number
}

interface Props {
  broadcasts: Broadcast[]
  stats: Stats
  businessId: string
}

export default function BroadcastsView({ broadcasts: initial, stats, businessId }: Props) {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>(initial)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this broadcast? This cannot be undone.')) return
    const sb = createClient()
    const { error } = await sb.from('broadcasts').delete().eq('id', id)
    if (error) { toast.error('Delete failed'); return }
    setBroadcasts(prev => prev.filter(b => b.id !== id))
    toast.success('Broadcast deleted')
  }

  const handleDuplicate = async (b: Broadcast) => {
    const sb = createClient()
    const { data, error } = await sb.from('broadcasts')
      .insert({ business_id: businessId, title: `${b.title} (copy)`, platform: b.platform, message: b.message, status: 'draft', recipient_count: 0, sent_count: 0, delivered_count: 0 })
      .select().single()
    if (error) { toast.error('Duplicate failed'); return }
    setBroadcasts(prev => [data as Broadcast, ...prev])
    toast.success('Broadcast duplicated')
  }

  const statCards = [
    { label: 'Total Sent',        value: stats.totalSent.toLocaleString(),    color: '#E4F0F6' },
    { label: 'Total Delivered',   value: stats.totalDelivered.toLocaleString(), color: '#00D97E' },
    { label: 'Avg Delivery Rate', value: `${stats.avgOpenRate}%`,              color: '#8729A0' },
    { label: 'Contacts Reached',  value: stats.totalReached.toLocaleString(),  color: '#F0A500' },
  ]

  return (
    <div className="space-y-5">
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#E4F0F6] text-xl font-bold">Broadcasts</h1>
          <p className="text-[#8892A4] text-sm mt-0.5">{broadcasts.length} total broadcasts</p>
        </div>
        <button onClick={() => router.push('/dashboard/broadcasts/new')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold"
          style={{ background: 'linear-gradient(135deg, #8729A0, #6a1f80)' }}>
          <Plus size={15} /> New Broadcast
        </button>
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((s) => (
          <div key={s.label} className="bg-[#0A1200] border border-[#1a2400] rounded-xl p-4">
            <p className="text-[#8892A4] text-xs">{s.label}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* empty */}
      {broadcasts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-24 bg-[#0A1200] border border-[#1a2400] rounded-xl text-[#8892A4]">
          <div className="w-16 h-16 rounded-2xl bg-[#1a2400] flex items-center justify-center">
            <Radio size={28} strokeWidth={1} />
          </div>
          <div className="text-center">
            <p className="font-semibold text-[#E4F0F6] text-lg">No broadcasts yet</p>
            <p className="text-sm mt-1 max-w-xs">Send your first message to all customers and reach everyone at once</p>
          </div>
          <button onClick={() => router.push('/dashboard/broadcasts/new')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
            style={{ background: 'linear-gradient(135deg, #8729A0, #6a1f80)' }}>
            <Send size={14} /> Create First Broadcast
          </button>
        </div>
      ) : (
        <div className="bg-[#0A1200] border border-[#1a2400] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1a2400]">
                  {['Title', 'Platform', 'Status', 'Recipients', 'Sent', 'Delivered', 'Created', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[#8892A4] text-xs font-semibold uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a2400]/60">
                {broadcasts.map((b) => {
                  const sc = STATUS_STYLES[b.status]
                  return (
                    <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3.5">
                        <p className="text-[#E4F0F6] text-sm font-semibold">{b.title}</p>
                        <p className="text-[#8892A4] text-xs truncate max-w-48">{b.message}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded-full bg-[#8729A0]/15 text-[#8729A0] text-[11px] font-semibold capitalize">{b.platform}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize"
                          style={{ background: sc.bg, color: sc.text }}>{b.status}</span>
                      </td>
                      <td className="px-4 py-3.5 text-[#E4F0F6] text-sm">{b.recipient_count}</td>
                      <td className="px-4 py-3.5 text-[#E4F0F6] text-sm">{b.sent_count}</td>
                      <td className="px-4 py-3.5 text-[#00D97E] text-sm">{b.delivered_count}</td>
                      <td className="px-4 py-3.5 text-[#8892A4] text-xs">{timeAgo(b.created_at)}</td>
                      <td className="px-4 py-3.5">
                        <div className="relative">
                          <button onClick={() => setOpenMenu(openMenu === b.id ? null : b.id)}
                            className="p-1.5 rounded-lg text-[#8892A4] hover:text-[#E4F0F6] hover:bg-white/[0.04]">
                            <MoreHorizontal size={15} />
                          </button>
                          {openMenu === b.id && (
                            <div className="absolute right-0 top-full mt-1 w-40 bg-[#0A1200] border border-[#1a2400] rounded-xl overflow-hidden z-10 shadow-xl">
                              <button onClick={() => { handleDuplicate(b); setOpenMenu(null) }}
                                className="w-full text-left px-3 py-2.5 text-sm text-[#E4F0F6] hover:bg-white/[0.04]">Duplicate</button>
                              <button onClick={() => { handleDelete(b.id); setOpenMenu(null) }}
                                className="w-full text-left px-3 py-2.5 text-sm text-[#ef4444] hover:bg-[#ef4444]/10 flex items-center gap-2">
                                <Trash2 size={13} /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
