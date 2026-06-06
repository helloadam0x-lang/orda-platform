'use client'

import React, { useState } from 'react'
import { Users, TrendingUp, CheckCircle, DollarSign, Search, Activity } from 'lucide-react'
import type { AdminBusiness } from '@/types/database'

interface PlatformStats {
  totalBusinesses: number
  activeThisMonth: number
  activeTotal: number
  totalRevenue: number
  mrr: number
  totalMessages: number
  totalContacts: number
}

interface AdminViewProps {
  businesses: AdminBusiness[]
  stats: PlatformStats
}

const PLAN_COLORS: Record<string, React.CSSProperties> = {
  trial:   { backgroundColor: 'rgba(212,168,83,0.12)',  color: '#D4A853' },
  starter: { backgroundColor: 'rgba(59,130,246,0.12)',  color: '#60a5fa' },
  pro:     { backgroundColor: 'rgba(37,211,102,0.12)',  color: '#25D366' },
}

export default function AdminView({ businesses, stats }: AdminViewProps) {
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState<'all' | 'trial' | 'starter' | 'pro'>('all')

  const filtered = businesses.filter(b => {
    const matchesSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.slug.toLowerCase().includes(search.toLowerCase()) ||
      b.country.toLowerCase().includes(search.toLowerCase())
    const matchesPlan = planFilter === 'all' || b.plan === planFilter
    return matchesSearch && matchesPlan
  })

  const statCards = [
    { label: 'Total Businesses', value: stats.totalBusinesses, icon: Users, color: '#D4A853' },
    { label: 'Active (30d)', value: stats.activeThisMonth, icon: TrendingUp, color: '#60a5fa' },
    { label: 'Active Total', value: stats.activeTotal, icon: CheckCircle, color: '#25D366' },
    { label: 'MRR (UGX)', value: `${(stats.mrr / 1000).toFixed(0)}k`, icon: DollarSign, color: '#a78bfa' },
  ]

  return (
    <div className="min-h-screen" style={{ background: 'var(--void, #050507)', color: 'white' }}>
      {/* Header */}
      <div className="border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Platform Admin</h1>
          <p className="text-sm text-white/40 mt-0.5">Orda Technologies — Internal Dashboard</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/30">
          <Activity className="w-3.5 h-3.5" />
          Live
        </div>
      </div>

      <div className="px-8 py-6 space-y-6 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs text-white/40 uppercase tracking-wider">{label}</p>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${color}18` }}
                >
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div
            className="flex items-center gap-2 flex-1 rounded-xl px-4 py-2.5"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <Search className="w-4 h-4 text-white/30 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search businesses…"
              className="flex-1 bg-transparent text-white placeholder-white/30 text-sm outline-none"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'trial', 'starter', 'pro'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPlanFilter(p)}
                className="px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all active:scale-95"
                style={
                  planFilter === p
                    ? { background: '#D4A853', color: '#050507' }
                    : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }
                }
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div
            className="px-5 py-3 flex items-center justify-between"
            style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
          >
            <p className="text-sm text-white/60">
              {filtered.length} business{filtered.length !== 1 ? 'es' : ''}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {['Business', 'Slug', 'Country', 'Plan', 'WhatsApp', 'Status', 'Joined'].map(h => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-medium text-white/30 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, i) => (
                  <tr
                    key={b.id}
                    style={{
                      borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : undefined,
                      background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                    }}
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-white">{b.name}</p>
                      {b.email && <p className="text-xs text-white/30 mt-0.5">{b.email}</p>}
                    </td>
                    <td className="px-5 py-3.5 text-white/50 font-mono text-xs">{b.slug}</td>
                    <td className="px-5 py-3.5 text-white/60">{b.country}{b.city ? `, ${b.city}` : ''}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
                        style={PLAN_COLORS[b.plan] ?? PLAN_COLORS.trial}
                      >
                        {b.plan}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs"
                        style={{ color: b.is_whatsapp_connected ? '#25D366' : 'rgba(255,255,255,0.3)' }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: b.is_whatsapp_connected ? '#25D366' : 'rgba(255,255,255,0.2)' }}
                        />
                        {b.is_whatsapp_connected ? 'Connected' : 'Offline'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs"
                        style={{ color: b.is_active ? '#25D366' : '#f87171' }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: b.is_active ? '#25D366' : '#f87171' }}
                        />
                        {b.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-white/30 text-xs">
                      {new Date(b.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-white/20 text-sm">
                      No businesses found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
