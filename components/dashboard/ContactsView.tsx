'use client'

import { useState } from 'react'
import { Search, UserPlus, X, ChevronUp, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getInitials, timeAgo, platformColor, formatCurrency } from '@/lib/utils'
import type { Contact, Platform } from '@/types/database'

type SortKey = 'created_at' | 'total_orders' | 'total_spent'
type SortDir = 'asc' | 'desc'

interface Props {
  contacts: Contact[]
  businessId: string
}

const PLATFORMS: Platform[] = ['whatsapp', 'instagram', 'tiktok', 'facebook']

export default function ContactsView({ contacts: initial, businessId }: Props) {
  const [contacts, setContacts] = useState<Contact[]>(initial)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('created_at')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [selected, setSelected] = useState<Contact | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState({ name: '', phone: '', email: '', platform: 'whatsapp' as Platform })
  const [addError, setAddError] = useState('')
  const [addLoading, setAddLoading] = useState(false)

  const sorted = contacts
    .filter((c) => {
      if (!search) return true
      const q = search.toLowerCase()
      return (
        c.name.toLowerCase().includes(q) ||
        (c.phone ?? '').toLowerCase().includes(q) ||
        (c.email ?? '').toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      const av = a[sortKey] ?? 0
      const bv = b[sortKey] ?? 0
      if (typeof av === 'string' && typeof bv === 'string') {
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      }
      return sortDir === 'asc' ? (Number(av) - Number(bv)) : (Number(bv) - Number(av))
    })

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('desc') }
  }

  const handleAdd = async () => {
    setAddError('')
    if (!addForm.name.trim()) { setAddError('Name is required'); return }
    setAddLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('contacts')
      .insert({ ...addForm, business_id: businessId })
      .select()
      .single()
    setAddLoading(false)
    if (error) { setAddError(error.message); return }
    if (data) setContacts((prev) => [data as Contact, ...prev])
    setShowAdd(false)
    setAddForm({ name: '', phone: '', email: '', platform: 'whatsapp' })
  }

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (
      sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
    ) : null

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-orda-grey" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, email…"
            className="w-full bg-orda-surface border border-orda-border rounded-lg pl-8 pr-3 py-2 text-[13px] text-orda-light placeholder:text-orda-grey outline-none focus:border-orda-accent/50"
          />
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orda-accent text-white text-sm font-semibold hover:bg-[#6a1f80] transition-colors"
        >
          <UserPlus size={15} />
          Add Contact
        </button>
      </div>

      {/* Table */}
      <div className="bg-orda-surface border border-orda-border rounded-[14px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-orda-border">
                {[
                  { label: 'Name', key: null },
                  { label: 'Phone', key: null },
                  { label: 'Platform', key: null },
                  { label: 'Orders', key: 'total_orders' as SortKey },
                  { label: 'Spent', key: 'total_spent' as SortKey },
                  { label: 'Last Active', key: 'created_at' as SortKey },
                  { label: 'Tags', key: null },
                  { label: '', key: null },
                ].map(({ label, key }) => (
                  <th
                    key={label}
                    onClick={() => key && toggleSort(key)}
                    className={`px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-orda-grey ${key ? 'cursor-pointer hover:text-orda-light select-none' : ''}`}
                  >
                    <div className="flex items-center gap-1">
                      {label}
                      {key && <SortIcon k={key} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-orda-grey text-sm">
                    No contacts found.
                  </td>
                </tr>
              ) : (
                sorted.map((c) => {
                  const color = platformColor(c.platform)
                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelected(c)}
                      className="border-b border-orda-border/50 hover:bg-white/[0.025] cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                            style={{ background: `linear-gradient(135deg, ${color}99, ${color}44)` }}
                          >
                            {getInitials(c.name)}
                          </div>
                          <span className="text-orda-light font-medium">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-orda-grey text-[13px]">{c.phone ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize"
                          style={{ background: `${color}20`, color }}
                        >
                          {c.platform}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-orda-light text-[13px]">{c.total_orders}</td>
                      <td className="px-4 py-3 text-orda-light text-[13px] font-medium">{formatCurrency(c.total_spent)}</td>
                      <td className="px-4 py-3 text-orda-grey text-[12px]">
                        {c.last_active ? timeAgo(c.last_active) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {(c.tags ?? []).slice(0, 2).map((tag) => (
                            <span key={tag} className="px-1.5 py-0.5 rounded bg-orda-border text-orda-grey text-[10px]">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelected(c) }}
                          className="text-orda-accent text-[12px] font-medium hover:underline"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contact detail sidebar */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-sm bg-orda-surface border-l border-orda-border h-full overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-orda-light font-bold font-space-grotesk text-lg">Contact Details</h2>
              <button onClick={() => setSelected(null)} className="text-orda-grey hover:text-orda-light">
                <X size={18} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${platformColor(selected.platform)}99, ${platformColor(selected.platform)}44)` }}
              >
                {getInitials(selected.name)}
              </div>
              <div>
                <p className="text-orda-light font-semibold">{selected.name}</p>
                <p className="text-orda-grey text-[12px]">{selected.email ?? selected.phone ?? '—'}</p>
              </div>
            </div>

            {[
              { label: 'Phone', value: selected.phone ?? '—' },
              { label: 'Email', value: selected.email ?? '—' },
              { label: 'Platform', value: selected.platform },
              { label: 'Country', value: '—' },
              { label: 'Total Orders', value: selected.total_orders.toString() },
              { label: 'Total Spent', value: formatCurrency(selected.total_spent) },
              { label: 'Last Active', value: selected.last_active ? timeAgo(selected.last_active) : '—' },
              { label: 'Member Since', value: timeAgo(selected.created_at) },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-orda-border/50">
                <span className="text-orda-grey text-[12px]">{label}</span>
                <span className="text-orda-light text-[13px] font-medium capitalize">{value}</span>
              </div>
            ))}

            {(selected.tags ?? []).length > 0 && (
              <div>
                <p className="text-orda-grey text-[11px] uppercase tracking-wider mb-2">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {(selected.tags ?? []).map((tag) => (
                    <span key={tag} className="px-2 py-1 rounded-md bg-orda-border text-orda-grey text-[11px]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add contact modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowAdd(false)} />
          <div className="relative w-full max-w-md bg-orda-surface border border-orda-border rounded-2xl p-6 m-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-orda-light font-bold font-space-grotesk text-lg">Add Contact</h2>
              <button onClick={() => setShowAdd(false)} className="text-orda-grey hover:text-orda-light">
                <X size={18} />
              </button>
            </div>

            {addError && (
              <p className="text-orda-error text-sm bg-orda-error/10 border border-orda-error/30 rounded-lg px-3 py-2">
                {addError}
              </p>
            )}

            <div className="space-y-3">
              {[
                { label: 'Name *', field: 'name', type: 'text', placeholder: 'John Doe' },
                { label: 'Phone', field: 'phone', type: 'tel', placeholder: '+256 700 123 456' },
                { label: 'Email', field: 'email', type: 'email', placeholder: 'john@example.com' },
              ].map(({ label, field, type, placeholder }) => (
                <div key={field}>
                  <label className="block text-orda-grey text-[11px] uppercase tracking-wider mb-1.5 font-medium">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={addForm[field as keyof typeof addForm]}
                    onChange={(e) => setAddForm((p) => ({ ...p, [field]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full bg-orda-black border border-orda-border rounded-lg px-3 py-2.5 text-sm text-orda-light placeholder:text-orda-grey outline-none focus:border-orda-accent/50"
                  />
                </div>
              ))}

              <div>
                <label className="block text-orda-grey text-[11px] uppercase tracking-wider mb-1.5 font-medium">
                  Platform
                </label>
                <select
                  value={addForm.platform}
                  onChange={(e) => setAddForm((p) => ({ ...p, platform: e.target.value as Platform }))}
                  className="w-full bg-orda-black border border-orda-border rounded-lg px-3 py-2.5 text-sm text-orda-light outline-none focus:border-orda-accent/50"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p} className="capitalize">{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleAdd}
              disabled={addLoading}
              className="w-full py-2.5 rounded-lg bg-orda-accent text-white font-semibold text-sm hover:bg-[#6a1f80] disabled:opacity-60 transition-colors"
            >
              {addLoading ? 'Adding…' : 'Add Contact'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
