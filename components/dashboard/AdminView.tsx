'use client'

import { useState } from 'react'
import { Search, MoreHorizontal, Shield } from 'lucide-react'
import type { AdminBusiness } from '@/types/database'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n)
}
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

interface PlatformStats {
  totalBusinesses: number
  activeThisMonth: number
  activeTotal: number
  totalRevenue: number
  mrr: number
  totalMessages: number
  totalContacts: number
}

interface Props {
  businesses: AdminBusiness[]
  stats: PlatformStats
}

const PLAN_COLORS: Record<string, { bg: string; text: string }> = {
  free:       { bg: '#8892A420', text: '#8892A4' },
  starter:    { bg: '#1877F220', text: '#1877F2' },
  pro:        { bg: '#8729A020', text: '#8729A0' },
  enterprise: { bg: '#F0A50020', text: '#F0A500' },
}
const STATUS_COLOR = { active: '#00D97E', trial: '#F0A500', expired: '#ef4444', suspended: '#8892A4' }

export default function AdminView({ businesses, stats }: Props) {
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('all')
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [selectedBiz, setSelectedBiz] = useState<AdminBusiness | null>(null)

  const filtered = businesses.filter((b) => {
    const q = search.toLowerCase()
    if (q && !b.name.toLowerCase().includes(q) && !(b.email ?? '').toLowerCase().includes(q)) return false
    if (planFilter !== 'all' && b.plan !== planFilter) return false
    return true
  })

  const getStatus = (b: AdminBusiness) => {
    if (!b.is_active) return 'suspended'
    const exp = new Date(b.plan_expires_at)
    if (exp < new Date()) return 'expired'
    const trialThreshold = new Date(b.plan_expires_at)
    trialThreshold.setDate(trialThreshold.getDate() - 3)
    if (trialThreshold < new Date()) return 'trial'
    return 'active'
  }

  const platforms = (b: AdminBusiness): string[] => [
    b.whatsapp_connected ? 'WA' : null,
    b.instagram_connected ? 'IG' : null,
    b.tiktok_connected ? 'TT' : null,
    b.facebook_connected ? 'FB' : null,
  ].filter((v): v is string => v !== null)

  const statCards = [
    { label: 'Total Businesses', value: stats.totalBusinesses,   color: '#E4F0F6' },
    { label: 'Active Total',     value: stats.activeTotal,       color: '#00D97E' },
    { label: 'This Month',       value: stats.activeThisMonth,   color: '#8729A0' },
    { label: 'Total Revenue',    value: fmt(stats.totalRevenue), color: '#F0A500', isString: true },
  ]

  return (
    <div className="space-y-5">
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-[#E4F0F6] text-xl font-bold">Orda Admin</h1>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ef4444]/20 text-[#ef4444] text-xs font-bold border border-[#ef4444]/30">
            <Shield size={11} /> Super Admin
          </span>
        </div>
        <p className="text-[#8892A4] text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((s) => (
          <div key={s.label} className="bg-[#0A1200] border border-[#1a2400] rounded-xl p-4">
            <p className="text-[#8892A4] text-xs">{s.label}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: s.color }}>
              {s.isString ? s.value : (s.value as number).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8892A4]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search business or email…"
            className="w-full bg-[#0A1200] border border-[#1a2400] rounded-lg pl-8 pr-3 py-2.5 text-sm text-[#E4F0F6] placeholder:text-[#8892A4] outline-none focus:border-[#8729A0]/50" />
        </div>
        <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)}
          className="bg-[#0A1200] border border-[#1a2400] rounded-lg px-3 py-2.5 text-sm text-[#E4F0F6] outline-none focus:border-[#8729A0]/50">
          <option value="all">All Plans</option>
          <option value="free">Free</option>
          <option value="starter">Starter</option>
          <option value="pro">Pro</option>
          <option value="enterprise">Enterprise</option>
        </select>
      </div>

      {/* table */}
      <div className="bg-[#0A1200] border border-[#1a2400] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a2400]">
                {['Business', 'Email', 'Plan', 'Country', 'Platforms', 'Status', 'Joined', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[#8892A4] text-xs font-semibold uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a2400]/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-[#8892A4] text-sm">No businesses found</td>
                </tr>
              ) : filtered.map((biz) => {
                const status = getStatus(biz)
                const statusColor = STATUS_COLOR[status as keyof typeof STATUS_COLOR]
                const planC = PLAN_COLORS[biz.plan] ?? PLAN_COLORS.free
                const plats = platforms(biz)
                return (
                  <tr key={biz.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3.5">
                      <p className="text-[#E4F0F6] text-sm font-semibold">{biz.name}</p>
                      {biz.phone && <p className="text-[#8892A4] text-xs">{biz.phone}</p>}
                    </td>
                    <td className="px-4 py-3.5 text-[#8892A4] text-sm">{biz.email ?? '—'}</td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize"
                        style={{ background: planC.bg, color: planC.text }}>{biz.plan}</span>
                    </td>
                    <td className="px-4 py-3.5 text-[#8892A4] text-sm">{biz.country}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-1">
                        {plats.length === 0 ? <span className="text-[#8892A4] text-xs">None</span> : plats.map(p => (
                          <span key={p} className="px-1.5 py-0.5 rounded bg-[#1a2400] text-[#8892A4] text-[10px] font-mono">{p}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="flex items-center gap-1.5 text-xs font-semibold capitalize">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
                        <span style={{ color: statusColor }}>{status}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-[#8892A4] text-xs">{timeAgo(biz.created_at)}</td>
                    <td className="px-4 py-3.5">
                      <div className="relative">
                        <button onClick={() => setOpenMenu(openMenu === biz.id ? null : biz.id)}
                          className="p-1.5 rounded-lg text-[#8892A4] hover:text-[#E4F0F6] hover:bg-white/[0.04]">
                          <MoreHorizontal size={15} />
                        </button>
                        {openMenu === biz.id && (
                          <div className="absolute right-0 top-full mt-1 w-44 bg-[#0A1200] border border-[#1a2400] rounded-xl overflow-hidden z-10 shadow-xl">
                            <button onClick={() => { setSelectedBiz(biz); setOpenMenu(null) }}
                              className="w-full text-left px-3 py-2.5 text-sm text-[#E4F0F6] hover:bg-white/[0.04]">View Details</button>
                            <button className="w-full text-left px-3 py-2.5 text-sm text-[#F0A500] hover:bg-[#F0A500]/10">
                              {biz.is_active ? 'Suspend Account' : 'Reactivate Account'}
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

      {/* business detail modal */}
      {selectedBiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#0A1200] border border-[#1a2400] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a2400]">
              <h3 className="text-[#E4F0F6] font-semibold">{selectedBiz.name}</h3>
              <button onClick={() => setSelectedBiz(null)} className="text-[#8892A4] hover:text-[#E4F0F6] text-lg">×</button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ['Email',   selectedBiz.email ?? '—'],
                  ['Phone',   selectedBiz.phone ?? '—'],
                  ['Country', selectedBiz.country],
                  ['Plan',    selectedBiz.plan],
                  ['Joined',  timeAgo(selectedBiz.created_at)],
                  ['Status',  getStatus(selectedBiz)],
                ].map(([k, v]) => (
                  <div key={k} className="bg-[#111111] rounded-lg p-3">
                    <p className="text-[#8892A4] text-xs">{k}</p>
                    <p className="text-[#E4F0F6] font-semibold mt-0.5 capitalize">{v}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[#8892A4] text-xs font-semibold uppercase tracking-wide mb-2">Connected Platforms</p>
                <div className="flex gap-2">
                  {[
                    { name: 'WhatsApp', connected: selectedBiz.whatsapp_connected },
                    { name: 'Instagram', connected: selectedBiz.instagram_connected },
                    { name: 'TikTok', connected: selectedBiz.tiktok_connected },
                    { name: 'Facebook', connected: selectedBiz.facebook_connected },
                  ].map(p => (
                    <span key={p.name} className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.connected ? 'bg-[#00D97E]/15 text-[#00D97E]' : 'bg-[#1a2400] text-[#8892A4]'}`}>
                      {p.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
