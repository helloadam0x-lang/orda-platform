'use client'

import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n)
}
function fmtNum(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}
function pctChange(curr: number, prev: number) {
  if (prev === 0) return curr > 0 ? 100 : 0
  return Math.round(((curr - prev) / prev) * 100)
}

const PLATFORM_COLORS: Record<string, string> = {
  whatsapp: '#25D366', instagram: '#E1306C', tiktok: '#ff0050', facebook: '#1877F2',
}
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface KPI { label: string; value: number; prev: number; format: string }
interface DayMsg { day: string; messages: number; ai_replies: number }
interface DayRev { day: string; revenue: number }
interface PlatData { platform: string; count: number }
interface TopContact { id: string; name: string; total_orders: number; total_spent: number; last_active: string | null }
interface FunnelStep { label: string; count: number }

interface Props {
  kpis: KPI[]
  dailyMessages: DayMsg[]
  dailyRevenue: DayRev[]
  platformData: PlatData[]
  topContacts: TopContact[]
  heatmap: number[][]
  funnel: FunnelStep[]
}

const darkTooltip = {
  contentStyle: { background: '#0A1200', border: '1px solid #1a2400', borderRadius: 12, color: '#E4F0F6', fontSize: 12 },
  labelStyle: { color: '#8892A4' },
  cursor: { fill: '#ffffff05' },
}

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export default function AnalyticsView({ kpis, dailyMessages, dailyRevenue, platformData, topContacts, heatmap, funnel }: Props) {
  const maxHeat = Math.max(...heatmap.flat(), 1)
  const totalPlatform = platformData.reduce((s, p) => s + p.count, 0)

  return (
    <div className="space-y-6">
      {/* header */}
      <div>
        <h1 className="text-[#E4F0F6] text-xl font-bold">Analytics</h1>
        <p className="text-[#8892A4] text-sm mt-0.5">Last 30 days performance</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpis.map((k) => {
          const pct  = pctChange(k.value, k.prev)
          const up   = pct > 0
          const flat = pct === 0
          return (
            <div key={k.label} className="bg-[#0A1200] border border-[#1a2400] rounded-xl p-4">
              <p className="text-[#8892A4] text-xs">{k.label}</p>
              <p className="text-[#E4F0F6] text-xl font-bold mt-1">
                {k.format === 'currency' ? fmt(k.value) : fmtNum(k.value)}
              </p>
              <div className={`flex items-center gap-1 mt-1 text-[11px] font-semibold ${flat ? 'text-[#8892A4]' : up ? 'text-[#00D97E]' : 'text-[#ef4444]'}`}>
                {flat ? <Minus size={11} /> : up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {flat ? 'No change' : `${up ? '+' : ''}${pct}%`}
              </div>
            </div>
          )
        })}
      </div>

      {/* charts row */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* message volume */}
        <div className="bg-[#0A1200] border border-[#1a2400] rounded-xl p-5">
          <h3 className="text-[#E4F0F6] font-semibold mb-4">Message Volume</h3>
          {dailyMessages.every(d => d.messages === 0) ? (
            <div className="h-48 flex items-center justify-center text-[#8892A4] text-sm">No message data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={dailyMessages} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="msgGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#1877F2" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1877F2" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="aiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#8729A0" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8729A0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2400" />
                <XAxis dataKey="day" tick={{ fill: '#8892A4', fontSize: 10 }} tickLine={false} axisLine={false} interval={4} />
                <YAxis tick={{ fill: '#8892A4', fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip {...darkTooltip} />
                <Area type="monotone" dataKey="messages"  stroke="#1877F2" strokeWidth={2} fill="url(#msgGrad)" name="Incoming" />
                <Area type="monotone" dataKey="ai_replies" stroke="#8729A0" strokeWidth={2} fill="url(#aiGrad)"  name="AI Replies" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* revenue */}
        <div className="bg-[#0A1200] border border-[#1a2400] rounded-xl p-5">
          <h3 className="text-[#E4F0F6] font-semibold mb-4">Revenue</h3>
          {dailyRevenue.every(d => d.revenue === 0) ? (
            <div className="h-48 flex items-center justify-center text-[#8892A4] text-sm">No revenue data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dailyRevenue} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2400" />
                <XAxis dataKey="day" tick={{ fill: '#8892A4', fontSize: 10 }} tickLine={false} axisLine={false} interval={4} />
                <YAxis tick={{ fill: '#8892A4', fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip {...darkTooltip} formatter={(v: unknown) => typeof v === 'number' ? fmt(v) : String(v ?? '')} />
                <Bar dataKey="revenue" fill="#8729A0" radius={[4, 4, 0, 0]} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* platform performance */}
      <div className="bg-[#0A1200] border border-[#1a2400] rounded-xl p-5">
        <h3 className="text-[#E4F0F6] font-semibold mb-4">Platform Performance</h3>
        {platformData.length === 0 ? (
          <div className="h-24 flex items-center justify-center text-[#8892A4] text-sm">No platform data yet</div>
        ) : (
          <div className="space-y-3">
            {platformData.sort((a, b) => b.count - a.count).map((p) => {
              const pct = totalPlatform > 0 ? Math.round((p.count / totalPlatform) * 100) : 0
              const color = PLATFORM_COLORS[p.platform] ?? '#8729A0'
              return (
                <div key={p.platform} className="flex items-center gap-3">
                  <span className="text-[#E4F0F6] text-sm capitalize w-24 flex-shrink-0">{p.platform}</span>
                  <div className="flex-1 bg-[#1a2400] rounded-full h-2">
                    <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                  </div>
                  <span className="text-[#8892A4] text-xs w-16 text-right">{p.count} ({pct}%)</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* top contacts + heatmap */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* top contacts */}
        <div className="bg-[#0A1200] border border-[#1a2400] rounded-xl p-5">
          <h3 className="text-[#E4F0F6] font-semibold mb-4">Top Contacts by Spend</h3>
          {topContacts.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-[#8892A4] text-sm">No contacts yet</div>
          ) : (
            <div className="space-y-3">
              {topContacts.slice(0, 8).map((c, i) => (
                <div key={c.id} className="flex items-center gap-3">
                  <span className="text-[#8892A4] text-xs w-5 flex-shrink-0">#{i + 1}</span>
                  <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ background: 'linear-gradient(135deg, #8729A0aa, #8729A044)' }}>
                    {getInitials(c.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#E4F0F6] text-sm font-semibold truncate">{c.name}</p>
                    <p className="text-[#8892A4] text-xs">{c.total_orders} orders</p>
                  </div>
                  <span className="text-[#E4F0F6] text-sm font-bold flex-shrink-0">{fmt(c.total_spent)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* hourly heatmap */}
        <div className="bg-[#0A1200] border border-[#1a2400] rounded-xl p-5">
          <h3 className="text-[#E4F0F6] font-semibold mb-4">Activity Heatmap</h3>
          <div className="overflow-x-auto">
            <div className="min-w-[360px]">
              {/* hour labels */}
              <div className="flex mb-1 ml-9">
                {[0, 3, 6, 9, 12, 15, 18, 21].map(h => (
                  <div key={h} className="flex-1 text-center text-[9px] text-[#8892A4]">{h}h</div>
                ))}
              </div>
              {DAYS.map((day, di) => (
                <div key={day} className="flex items-center gap-1 mb-0.5">
                  <span className="text-[#8892A4] text-[10px] w-8 flex-shrink-0">{day}</span>
                  <div className="flex gap-0.5 flex-1">
                    {heatmap[di].map((val, hi) => {
                      const intensity = maxHeat > 0 ? val / maxHeat : 0
                      return (
                        <div key={hi} title={`${day} ${hi}:00 — ${val} messages`}
                          className="flex-1 h-4 rounded-sm transition-all"
                          style={{ background: intensity > 0 ? `rgba(135, 41, 160, ${0.1 + intensity * 0.9})` : '#1a2400' }} />
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 justify-end">
            <span className="text-[#8892A4] text-[10px]">Low</span>
            <div className="flex gap-0.5">
              {[0.1, 0.3, 0.5, 0.7, 0.9].map(o => (
                <div key={o} className="w-4 h-3 rounded-sm" style={{ background: `rgba(135,41,160,${o})` }} />
              ))}
            </div>
            <span className="text-[#8892A4] text-[10px]">High</span>
          </div>
        </div>
      </div>

      {/* conversion funnel */}
      <div className="bg-[#0A1200] border border-[#1a2400] rounded-xl p-5">
        <h3 className="text-[#E4F0F6] font-semibold mb-5">Conversion Funnel</h3>
        <div className="flex items-end gap-2">
          {funnel.map((step, i) => {
            const maxVal = funnel[0].count || 1
            const pct    = Math.round((step.count / maxVal) * 100)
            const convPct = i > 0 && funnel[i - 1].count > 0
              ? Math.round((step.count / funnel[i - 1].count) * 100)
              : null
            return (
              <div key={step.label} className="flex-1 flex flex-col items-center gap-2">
                {convPct !== null && (
                  <span className="text-[#8892A4] text-[10px]">↓ {convPct}%</span>
                )}
                <div className="w-full rounded-t-lg transition-all"
                  style={{
                    height: `${Math.max(pct * 1.2, 20)}px`,
                    background: `linear-gradient(180deg, #8729A0, #6a1f80)`,
                    opacity: 0.3 + (0.7 * (1 - i / funnel.length)),
                  }} />
                <div className="text-center">
                  <p className="text-[#E4F0F6] font-bold text-sm">{step.count.toLocaleString()}</p>
                  <p className="text-[#8892A4] text-[10px] mt-0.5 leading-tight">{step.label}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
