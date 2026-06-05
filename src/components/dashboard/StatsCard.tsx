'use client'

import type { ReactNode } from 'react'

interface StatsCardProps {
  label: string
  value: string | number | null
  icon: ReactNode
  loading?: boolean
  trend?: { value: number; positive: boolean } | null
  accent?: boolean
}

export function StatsCard({ label, value, icon, loading, trend, accent }: StatsCardProps) {
  return (
    <div
      className="rounded-[var(--r-lg)] p-4 flex flex-col gap-3"
      style={{
        background: accent ? 'var(--accent-dim)' : 'var(--surface-2)',
        border: `1px solid ${accent ? 'var(--accent-border)' : 'var(--border)'}`,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-[var(--text-3)] uppercase tracking-wide">{label}</span>
        <div
          className="w-8 h-8 rounded-[var(--r-sm)] flex items-center justify-center"
          style={{ background: accent ? 'rgba(212,168,83,0.15)' : 'var(--surface-3)', color: 'var(--accent)' }}
        >
          {icon}
        </div>
      </div>

      {loading ? (
        <div className="h-8 w-24 rounded skeleton" />
      ) : (
        <div className="font-['Playfair_Display'] font-black text-[28px] leading-none text-[var(--text-1)]">
          {value ?? '—'}
        </div>
      )}

      {trend && !loading && (
        <div
          className="flex items-center gap-1 text-[12px] font-medium"
          style={{ color: trend.positive ? 'var(--success)' : 'var(--error)' }}
        >
          <span>{trend.positive ? '↑' : '↓'}</span>
          <span>{Math.abs(trend.value)}% vs yesterday</span>
        </div>
      )}
    </div>
  )
}
