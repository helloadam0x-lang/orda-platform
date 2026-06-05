'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BarChart2, TrendingUp, Users, MessageSquare, ShoppingBag } from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'

const PERIODS = [7, 30, 90]

export default function AnalyticsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [currency, setCurrency] = useState('USD')
  const [period, setPeriod] = useState(30)
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/sign-in'); return }
      supabase.from('businesses').select('id, currency').eq('user_id', user.id).single()
        .then(({ data: biz }) => {
          if (biz) { setBusinessId(biz.id); setCurrency(biz.currency ?? 'USD') }
        })
    })
  }, [])

  useEffect(() => {
    if (!businessId) return
    setLoading(true)
    fetch(`/api/analytics?period=${period}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [businessId, period])

  const stats = data?.summary ?? {}
  const revenueChart = data?.revenue_chart ?? []
  const ordersChart = data?.orders_chart ?? []
  const topProducts = data?.top_products ?? []
  const topCustomers = data?.top_customers ?? []
  const aiStats = data?.ai_stats ?? { ai_handled: 0, manual: 0 }

  const pieData = [
    { name: 'AI Handled', value: aiStats.ai_handled },
    { name: 'Manual', value: aiStats.manual },
  ]

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-['Playfair_Display'] font-black text-2xl text-[var(--text-1)]">Analytics</h1>
          <p className="text-[13px] text-[var(--text-3)] mt-1">Business performance overview</p>
        </div>
        <div className="flex gap-1 p-1 rounded-[var(--r-md)]" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
          {PERIODS.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="px-3 py-1.5 rounded-[var(--r-sm)] text-[12px] font-medium transition-colors duration-150"
              style={{
                background: period === p ? 'var(--accent)' : 'transparent',
                color: period === p ? 'var(--void)' : 'var(--text-2)',
              }}
            >
              {p}d
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Revenue', value: loading ? null : formatCurrency(stats.revenue ?? 0, currency), icon: <TrendingUp size={16} /> },
          { label: 'Orders', value: loading ? null : stats.orders ?? 0, icon: <ShoppingBag size={16} /> },
          { label: 'Messages', value: loading ? null : stats.messages ?? 0, icon: <MessageSquare size={16} /> },
          { label: 'New Customers', value: loading ? null : stats.new_customers ?? 0, icon: <Users size={16} /> },
        ].map(s => (
          <div key={s.label} className="rounded-[var(--r-lg)] p-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase tracking-wide text-[var(--text-3)]">{s.label}</span>
              <span style={{ color: 'var(--accent)' }}>{s.icon}</span>
            </div>
            {s.value === null
              ? <div className="h-8 w-20 skeleton rounded" />
              : <div className="font-['Playfair_Display'] font-black text-[26px] text-[var(--text-1)]">{s.value}</div>
            }
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="rounded-[var(--r-lg)] p-5" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
        <div className="text-[14px] font-semibold text-[var(--text-1)] mb-4">Revenue</div>
        {loading ? (
          <div className="h-52 skeleton rounded" />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenueChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-3)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-3)' }} />
              <Tooltip
                contentStyle={{ background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
              />
              <Line type="monotone" dataKey="revenue" stroke="var(--accent)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Orders + Messages chart */}
      <div className="rounded-[var(--r-lg)] p-5" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
        <div className="text-[14px] font-semibold text-[var(--text-1)] mb-4">Orders & Messages</div>
        {loading ? (
          <div className="h-52 skeleton rounded" />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ordersChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-3)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-3)' }} />
              <Tooltip contentStyle={{ background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="orders" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="messages" fill="rgba(212,168,83,0.3)" radius={[4, 4, 0, 0]} />
              <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-2)' }} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top products */}
        <div className="lg:col-span-1 rounded-[var(--r-lg)] p-5" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
          <div className="text-[14px] font-semibold text-[var(--text-1)] mb-4">Top Products</div>
          {loading ? (
            <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-8 skeleton rounded" />)}</div>
          ) : topProducts.length === 0 ? (
            <div className="text-[13px] text-[var(--text-3)]">No data yet</div>
          ) : topProducts.slice(0, 6).map((p: any, i: number) => (
            <div key={p.id ?? i} className="flex items-center justify-between py-2" style={{ borderBottom: i < topProducts.length - 1 ? '1px solid var(--border)' : undefined }}>
              <span className="text-[13px] text-[var(--text-1)] truncate">{p.name}</span>
              <span className="text-[12px] font-semibold text-[var(--accent)] shrink-0 ml-3">{formatCurrency(p.revenue ?? 0, currency)}</span>
            </div>
          ))}
        </div>

        {/* AI performance */}
        <div className="lg:col-span-1 rounded-[var(--r-lg)] p-5" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
          <div className="text-[14px] font-semibold text-[var(--text-1)] mb-4">AI Performance</div>
          {loading ? (
            <div className="h-40 skeleton rounded" />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={4} dataKey="value">
                    <Cell fill="var(--accent)" />
                    <Cell fill="rgba(255,255,255,0.1)" />
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center mt-2">
                <div className="text-[12px] text-[var(--text-3)]">
                  AI handled <span className="text-[var(--accent)] font-semibold">{aiStats.ai_handled}</span> of <span className="font-semibold text-[var(--text-1)]">{aiStats.ai_handled + aiStats.manual}</span> messages
                </div>
              </div>
            </>
          )}
        </div>

        {/* Top customers */}
        <div className="lg:col-span-1 rounded-[var(--r-lg)] p-5" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
          <div className="text-[14px] font-semibold text-[var(--text-1)] mb-4">Top Customers</div>
          {loading ? (
            <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-8 skeleton rounded" />)}</div>
          ) : topCustomers.length === 0 ? (
            <div className="text-[13px] text-[var(--text-3)]">No data yet</div>
          ) : topCustomers.slice(0, 5).map((c: any, i: number) => (
            <div key={c.id ?? i} className="flex items-center justify-between py-2" style={{ borderBottom: i < topCustomers.length - 1 ? '1px solid var(--border)' : undefined }}>
              <span className="text-[13px] text-[var(--text-1)] truncate">{c.name}</span>
              <span className="text-[12px] font-semibold text-[var(--accent)] shrink-0 ml-3">{formatCurrency(c.spent ?? 0, currency)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
