'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Package, Truck, Check, LogIn } from 'lucide-react'
import { formatCurrency, timeAgo } from '@/lib/format'

export default function StaffPage() {
  const supabase = createClient()
  const [staffCode, setStaffCode] = useState('')
  const [staff, setStaff] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [currency, setCurrency] = useState('USD')
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)

  async function login() {
    if (!staffCode.trim()) return
    setLoading(true)
    setLoginError('')
    const { data: s } = await supabase.from('staff').select('*, businesses(id, name, currency)')
      .eq('staff_code', staffCode.trim().toUpperCase()).eq('is_active', true).single()
    if (!s) { setLoginError('Invalid staff code'); setLoading(false); return }
    setStaff(s)
    setCurrency((s.businesses as any)?.currency ?? 'USD')
    const { data: o } = await supabase
      .from('orders')
      .select('id, order_number, customer_name, address, items, total, delivery_fee, status, created_at')
      .eq('business_id', (s.businesses as any)?.id)
      .in('status', ['confirmed', 'packed', 'out_for_delivery'])
      .order('created_at', { ascending: false })
    setOrders(o ?? [])
    setLoading(false)
  }

  async function updateStatus(orderId: string, status: string) {
    setUpdating(orderId)
    await supabase.rpc('update_order_status', { p_order_id: orderId, p_business_id: staff.business_id, p_status: status })
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o).filter(o => o.status !== 'delivered'))
    setUpdating(null)
  }

  const nextStatus = (status: string) => {
    if (status === 'confirmed') return 'packed'
    if (status === 'packed') return 'out_for_delivery'
    if (status === 'out_for_delivery') return 'delivered'
    return null
  }

  const nextLabel = (status: string) => {
    if (status === 'confirmed') return 'Mark Packed'
    if (status === 'packed') return 'Out for Delivery'
    if (status === 'out_for_delivery') return 'Mark Delivered ✓'
    return null
  }

  if (!staff) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--void)', fontFamily: "'DM Sans', sans-serif" }}>
        <div className="w-full max-w-sm px-6 space-y-6">
          <div className="text-center">
            <div className="font-['Playfair_Display'] font-black text-2xl text-[var(--text-1)]">
              ORDA<span style={{ color: 'var(--accent)' }}>.</span>
            </div>
            <div className="text-[14px] text-[var(--text-3)] mt-1">Staff Login</div>
          </div>
          <div>
            <input
              value={staffCode}
              onChange={e => setStaffCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && login()}
              placeholder="STAFF CODE"
              className="w-full px-4 py-3 rounded-[var(--r-lg)] text-[14px] font-bold tracking-widest bg-[var(--surface-2)] text-[var(--text-1)] placeholder:text-[var(--text-3)] outline-none text-center"
              style={{ border: '1px solid var(--border)' }}
            />
            {loginError && <div className="text-[12px] mt-2 text-center" style={{ color: 'var(--error)' }}>{loginError}</div>}
          </div>
          <button
            onClick={login}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-[var(--r-lg)] text-[14px] font-semibold transition-all duration-150 disabled:opacity-50"
            style={{ background: 'var(--accent)', color: 'var(--void)' }}
          >
            <LogIn size={15} />
            {loading ? 'Logging in…' : 'Log In'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--void)', fontFamily: "'DM Sans', sans-serif" }}>
      <div className="sticky top-0 z-10 px-4 h-14 flex items-center justify-between" style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border)' }}>
        <div className="font-['Playfair_Display'] font-black text-lg text-[var(--text-1)]">
          ORDA<span style={{ color: 'var(--accent)' }}>.</span>
        </div>
        <div>
          <div className="text-[13px] text-[var(--text-2)]">{staff.name}</div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <h2 className="font-['Playfair_Display'] font-black text-xl text-[var(--text-1)]">
          Active Orders <span style={{ color: 'var(--accent)' }}>({orders.length})</span>
        </h2>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-[var(--text-3)]">
            <Check size={36} className="mb-3 opacity-30" />
            <div className="text-[14px]">All caught up!</div>
          </div>
        ) : orders.map(o => {
          const next = nextStatus(o.status)
          return (
            <div
              key={o.id}
              className="rounded-[var(--r-xl)] p-5 space-y-3"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-bold" style={{ color: 'var(--accent)' }}>{o.order_number}</div>
                  <div className="text-[12px] text-[var(--text-3)]">{timeAgo(o.created_at)}</div>
                </div>
                <div
                  className="px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize"
                  style={{
                    background: o.status === 'out_for_delivery' ? 'rgba(212,168,83,0.1)' : 'var(--surface-3)',
                    color: o.status === 'out_for_delivery' ? 'var(--accent)' : 'var(--text-2)',
                  }}
                >
                  {o.status.replace('_', ' ')}
                </div>
              </div>

              <div>
                <div className="text-[13px] font-semibold text-[var(--text-1)]">{o.customer_name}</div>
                {o.address && <div className="text-[12px] text-[var(--text-3)] mt-0.5">📍 {o.address}</div>}
              </div>

              <div>
                {((o.items as any[]) ?? []).slice(0, 3).map((item: any, i: number) => (
                  <div key={i} className="text-[12px] text-[var(--text-2)]">• {item.name} × {item.quantity}</div>
                ))}
                {o.items?.length > 3 && <div className="text-[12px] text-[var(--text-3)]">+{o.items.length - 3} more</div>}
              </div>

              <div className="flex items-center justify-between">
                <div className="font-['Playfair_Display'] font-black text-lg" style={{ color: 'var(--accent)' }}>{formatCurrency(o.total, currency)}</div>
                {next && (
                  <button
                    onClick={() => updateStatus(o.id, next)}
                    disabled={updating === o.id}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-[var(--r-md)] text-[12px] font-semibold transition-all duration-150 disabled:opacity-50"
                    style={{ background: 'var(--accent)', color: 'var(--void)' }}
                    onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)' }}
                    onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
                  >
                    {next === 'out_for_delivery' ? <Truck size={13} /> : next === 'delivered' ? <Check size={13} /> : <Package size={13} />}
                    {updating === o.id ? 'Updating…' : nextLabel(o.status)}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
