'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Search, Users, Crown, MessageSquare, ChevronRight } from 'lucide-react'
import { getAvatarGradient, formatCurrency, timeAgo } from '@/lib/format'

interface Contact {
  id: string
  name: string
  phone: string
  platform: string
  order_count: number
  total_spent: number
  last_active: string
  is_vip: boolean
  is_blocked: boolean
}

const SORT_OPTIONS = [
  { value: 'last_active', label: 'Last Active' },
  { value: 'orders', label: 'Orders' },
  { value: 'spent', label: 'Spent' },
  { value: 'name', label: 'Name' },
]

export default function ContactsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [currency, setCurrency] = useState('USD')
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('last_active')
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 50

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/sign-in'); return }
      supabase.from('businesses').select('id, currency').eq('user_id', user.id).single()
        .then(({ data: biz }) => { if (biz) { setBusinessId(biz.id); setCurrency(biz.currency ?? 'USD') } })
    })
  }, [])

  const fetchContacts = useCallback(async () => {
    if (!businessId) return
    setLoading(true)
    let q = supabase
      .from('contacts')
      .select('id, name, phone, platform, order_count, total_spent, last_active_at, is_vip, is_blocked')
      .eq('business_id', businessId)
      .eq('is_blocked', false)
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

    if (search) q = q.or(`name.ilike.%${search}%,phone.ilike.%${search}%`)

    const orderMap: Record<string, string> = {
      last_active: 'last_active_at',
      orders: 'order_count',
      spent: 'total_spent',
      name: 'name',
    }
    q = q.order(orderMap[sort] ?? 'last_active_at', { ascending: sort === 'name' })

    const { data } = await q
    setLoading(false)
    if (!data) return
    setContacts(data.map((c: any) => ({
      id: c.id, name: c.name ?? 'Unknown', phone: c.phone ?? '',
      platform: c.platform ?? 'whatsapp', order_count: c.order_count ?? 0,
      total_spent: c.total_spent ?? 0, last_active: c.last_active_at ?? '',
      is_vip: c.is_vip ?? false, is_blocked: c.is_blocked ?? false,
    })))
  }, [businessId, search, sort, page])

  useEffect(() => {
    const t = setTimeout(fetchContacts, 300)
    return () => clearTimeout(t)
  }, [fetchContacts])

  async function toggleVIP(id: string, current: boolean) {
    await supabase.from('contacts').update({ is_vip: !current }).eq('id', id)
    setContacts(prev => prev.map(c => c.id === id ? { ...c, is_vip: !current } : c))
  }

  const totalContacts = contacts.length
  const vipCount = contacts.filter(c => c.is_vip).length

  return (
    <div className="p-6 space-y-5 max-w-6xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-['Playfair_Display'] font-black text-2xl text-[var(--text-1)]">Contacts</h1>
          <p className="text-[13px] text-[var(--text-3)] mt-1">{totalContacts} total · {vipCount} VIP</p>
        </div>
        <button
          onClick={() => {/* export */}}
          className="px-4 py-2 rounded-[var(--r-md)] text-[13px] font-medium transition-all duration-150"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-2)' }}
        >
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or phone…"
            className="w-full pl-8 pr-3 py-2 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-2)] text-[var(--text-1)] placeholder:text-[var(--text-3)] outline-none"
            style={{ border: '1px solid var(--border)' }}
          />
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="px-3 py-2 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-2)] text-[var(--text-1)] outline-none"
          style={{ border: '1px solid var(--border)' }}
        >
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-[var(--r-lg)] overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
              {['Contact', 'Phone', 'Orders', 'Spent', 'Last Active', 'VIP', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[11px] uppercase tracking-wide text-[var(--text-3)] font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 skeleton rounded w-16" /></td>
                  ))}
                </tr>
              ))
            ) : contacts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-[var(--text-3)] text-[13px]">
                  <Users size={24} className="mx-auto mb-2 opacity-30" />
                  No contacts yet
                </td>
              </tr>
            ) : contacts.map(c => (
              <tr
                key={c.id}
                className="hover:bg-[var(--surface-2)] transition-colors duration-150 cursor-pointer"
                style={{ borderBottom: '1px solid var(--border)' }}
                onClick={() => router.push(`/dashboard/contacts/${c.id}`)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                      style={{ background: getAvatarGradient(c.name) }}
                    >
                      {c.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-[13px] font-medium text-[var(--text-1)]">{c.name}</span>
                        {c.is_vip && <Crown size={12} style={{ color: 'var(--accent)' }} />}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-[13px] text-[var(--text-2)]">{c.phone}</td>
                <td className="px-4 py-3 text-[13px] text-[var(--text-1)] font-medium">{c.order_count}</td>
                <td className="px-4 py-3 text-[13px] font-semibold" style={{ color: 'var(--accent)' }}>{formatCurrency(c.total_spent, currency)}</td>
                <td className="px-4 py-3 text-[12px] text-[var(--text-3)]">{c.last_active ? timeAgo(c.last_active) : '—'}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={e => { e.stopPropagation(); toggleVIP(c.id, c.is_vip) }}
                    className="p-1 rounded"
                    style={{ color: c.is_vip ? 'var(--accent)' : 'var(--text-3)' }}
                  >
                    <Crown size={15} />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={e => { e.stopPropagation(); /* open WhatsApp */ }}
                      className="p-1.5 rounded text-[var(--text-3)] hover:text-[var(--whatsapp)]"
                    >
                      <MessageSquare size={14} />
                    </button>
                    <ChevronRight size={14} style={{ color: 'var(--text-3)' }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-[var(--text-3)]">Page {page + 1}</span>
        <div className="flex gap-2">
          <button
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1.5 rounded-[var(--r-md)] text-[12px] disabled:opacity-30 transition-colors duration-150"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-2)' }}
          >
            Previous
          </button>
          <button
            disabled={contacts.length < PAGE_SIZE}
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1.5 rounded-[var(--r-md)] text-[12px] disabled:opacity-30 transition-colors duration-150"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-2)' }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
