'use client'

import { useState } from 'react'
import { Search, Plus, MoreHorizontal, X, ShoppingBag, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { Order, OrderStatus, OrderItem } from '@/types/database'

// ── helpers ───────────────────────────────────────────────────────────────────
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
function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}
function platformColor(p: string) {
  const m: Record<string, string> = { whatsapp: '#25D366', instagram: '#E1306C', tiktok: '#ff0050', facebook: '#1877F2' }
  return m[p?.toLowerCase()] ?? '#8729A0'
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending:   { bg: '#F0A500/15', text: '#F0A500' },
  confirmed: { bg: '#1877F2/15', text: '#1877F2' },
  preparing: { bg: '#ff6b00/15', text: '#ff6b00' },
  delivered: { bg: '#00D97E/15', text: '#00D97E' },
  cancelled: { bg: '#ef4444/15', text: '#ef4444' },
}
const PAY_COLORS: Record<string, { bg: string; text: string }> = {
  unpaid:  { bg: '#ef444420', text: '#ef4444' },
  paid:    { bg: '#00D97E20', text: '#00D97E' },
  partial: { bg: '#F0A50020', text: '#F0A500' },
}

interface Stats { total: number; pending: number; delivered: number; revenue: number }
interface Props { orders: Order[]; stats: Stats; businessId: string }

// ── new order modal ──────────────────────────────────────────────────────────
function NewOrderModal({ businessId, onClose, onCreated }: { businessId: string; onClose: () => void; onCreated: (o: Order) => void }) {
  const [contactSearch, setContactSearch] = useState('')
  const [contacts, setContacts] = useState<{ id: string; name: string; phone: string | null }[]>([])
  const [selectedContact, setSelectedContact] = useState<{ id: string; name: string } | null>(null)
  const [items, setItems] = useState<{ name: string; quantity: number; unit_price: number }[]>([{ name: '', quantity: 1, unit_price: 0 }])
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const searchContacts = async (q: string) => {
    setContactSearch(q)
    if (!q) { setContacts([]); return }
    const sb = createClient()
    const { data } = await sb.from('contacts').select('id, name, phone').eq('business_id', businessId).ilike('name', `%${q}%`).limit(5)
    setContacts((data ?? []) as { id: string; name: string; phone: string | null }[])
  }

  const total = items.reduce((s, i) => s + (i.quantity * i.unit_price), 0)

  const handleSubmit = async () => {
    if (!selectedContact) { toast.error('Select a contact'); return }
    if (items.some(i => !i.name.trim())) { toast.error('All items need a name'); return }
    setSubmitting(true)
    const sb = createClient()
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`
    const { data, error } = await sb.from('orders')
      .insert({
        business_id: businessId,
        contact_id: selectedContact.id,
        order_number: orderNumber,
        amount: total,
        status: 'pending',
        payment_status: 'unpaid',
        items: items,
        delivery_address: deliveryAddress || null,
        payment_method: paymentMethod,
        notes: notes || null,
      })
      .select('*, contact:contacts(name, phone, platform)')
      .single()
    if (error) { toast.error('Failed to create order'); setSubmitting(false); return }
    toast.success(`Order ${orderNumber} created`)
    onCreated(data as unknown as Order)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-[#0A1200] border border-[#1a2400] rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a2400]">
          <h3 className="text-[#E4F0F6] font-semibold">New Order</h3>
          <button onClick={onClose} className="text-[#8892A4] hover:text-[#E4F0F6]"><X size={18} /></button>
        </div>
        <div className="overflow-y-auto p-5 space-y-4 flex-1">
          {/* contact */}
          <div>
            <label className="text-[#8892A4] text-xs mb-1.5 block">Customer *</label>
            {selectedContact ? (
              <div className="flex items-center justify-between px-3 py-2 bg-[#111111] border border-[#8729A0]/40 rounded-lg">
                <span className="text-[#E4F0F6] text-sm">{selectedContact.name}</span>
                <button onClick={() => setSelectedContact(null)} className="text-[#8892A4]"><X size={13} /></button>
              </div>
            ) : (
              <div className="relative">
                <input value={contactSearch} onChange={(e) => searchContacts(e.target.value)}
                  placeholder="Search contact name…"
                  className="w-full bg-[#111111] border border-[#1a2400] rounded-lg px-3 py-2 text-sm text-[#E4F0F6] placeholder:text-[#8892A4] outline-none focus:border-[#8729A0]/50" />
                {contacts.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#0A1200] border border-[#1a2400] rounded-lg overflow-hidden z-10">
                    {contacts.map(c => (
                      <button key={c.id} onClick={() => { setSelectedContact(c); setContacts([]) }}
                        className="w-full text-left px-3 py-2 text-sm text-[#E4F0F6] hover:bg-white/[0.04]">{c.name} {c.phone && <span className="text-[#8892A4]">· {c.phone}</span>}</button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          {/* items */}
          <div>
            <label className="text-[#8892A4] text-xs mb-1.5 block">Items *</label>
            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input value={item.name} onChange={(e) => setItems(prev => prev.map((it, i) => i === idx ? { ...it, name: e.target.value } : it))}
                    placeholder="Item name" className="flex-1 bg-[#111111] border border-[#1a2400] rounded-lg px-3 py-2 text-sm text-[#E4F0F6] placeholder:text-[#8892A4] outline-none focus:border-[#8729A0]/50" />
                  <input type="number" min="1" value={item.quantity} onChange={(e) => setItems(prev => prev.map((it, i) => i === idx ? { ...it, quantity: +e.target.value } : it))}
                    className="w-14 bg-[#111111] border border-[#1a2400] rounded-lg px-2 py-2 text-sm text-[#E4F0F6] outline-none focus:border-[#8729A0]/50 text-center" />
                  <input type="number" min="0" step="0.01" value={item.unit_price} onChange={(e) => setItems(prev => prev.map((it, i) => i === idx ? { ...it, unit_price: +e.target.value } : it))}
                    placeholder="Price" className="w-20 bg-[#111111] border border-[#1a2400] rounded-lg px-2 py-2 text-sm text-[#E4F0F6] outline-none focus:border-[#8729A0]/50" />
                  {items.length > 1 && <button onClick={() => setItems(prev => prev.filter((_, i) => i !== idx))} className="text-[#8892A4] hover:text-[#ef4444]"><X size={14} /></button>}
                </div>
              ))}
              <button onClick={() => setItems(prev => [...prev, { name: '', quantity: 1, unit_price: 0 }])}
                className="text-[#8729A0] text-xs font-semibold hover:underline">+ Add item</button>
            </div>
          </div>
          {/* address */}
          <div>
            <label className="text-[#8892A4] text-xs mb-1.5 block">Delivery Address</label>
            <input value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Optional"
              className="w-full bg-[#111111] border border-[#1a2400] rounded-lg px-3 py-2 text-sm text-[#E4F0F6] placeholder:text-[#8892A4] outline-none focus:border-[#8729A0]/50" />
          </div>
          {/* payment */}
          <div>
            <label className="text-[#8892A4] text-xs mb-1.5 block">Payment Method</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full bg-[#111111] border border-[#1a2400] rounded-lg px-3 py-2 text-sm text-[#E4F0F6] outline-none focus:border-[#8729A0]/50">
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="transfer">Bank Transfer</option>
              <option value="mobile_money">Mobile Money</option>
            </select>
          </div>
          {/* notes */}
          <div>
            <label className="text-[#8892A4] text-xs mb-1.5 block">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
              className="w-full bg-[#111111] border border-[#1a2400] rounded-lg px-3 py-2 text-sm text-[#E4F0F6] placeholder:text-[#8892A4] outline-none focus:border-[#8729A0]/50 resize-none" />
          </div>
          {/* total */}
          <div className="flex justify-between items-center pt-2 border-t border-[#1a2400]">
            <span className="text-[#8892A4] text-sm">Total</span>
            <span className="text-[#E4F0F6] font-bold text-lg">{fmt(total)}</span>
          </div>
        </div>
        <div className="px-5 py-4 border-t border-[#1a2400] flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[#1a2400] text-[#8892A4] text-sm hover:text-[#E4F0F6] transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={submitting} className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-40 transition-all"
            style={{ background: 'linear-gradient(135deg, #8729A0, #6a1f80)' }}>
            {submitting ? 'Creating…' : 'Create Order'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── order detail panel ────────────────────────────────────────────────────────
function OrderDetail({ order, onClose, onUpdate }: { order: Order; onClose: () => void; onUpdate: (o: Order) => void }) {
  const [updating, setUpdating] = useState(false)

  const updateStatus = async (status: OrderStatus) => {
    setUpdating(true)
    const sb = createClient()
    const { error } = await sb.from('orders').update({ status }).eq('id', order.id)
    if (error) { toast.error('Update failed'); setUpdating(false); return }
    toast.success(`Order marked as ${status}`)
    onUpdate({ ...order, status })
    setUpdating(false)
  }

  const markPaid = async () => {
    setUpdating(true)
    const sb = createClient()
    const { error } = await sb.from('orders').update({ payment_status: 'paid' }).eq('id', order.id)
    if (error) { toast.error('Update failed'); setUpdating(false); return }
    toast.success('Marked as paid')
    onUpdate({ ...order, payment_status: 'paid' })
    setUpdating(false)
  }

  const items: OrderItem[] = Array.isArray(order.items) ? order.items : []
  const statusColors = STATUS_COLORS[order.status] ?? { bg: '#8892A420', text: '#8892A4' }
  const payColors = PAY_COLORS[order.payment_status ?? 'unpaid'] ?? PAY_COLORS.unpaid

  const STEPS: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'delivered']
  const currentStep = STEPS.indexOf(order.status as OrderStatus)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md h-full bg-[#0A1200] border-l border-[#1a2400] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a2400] sticky top-0 bg-[#0A1200] z-10">
          <div>
            <h3 className="text-[#E4F0F6] font-semibold">{order.order_number}</h3>
            <p className="text-[#8892A4] text-xs">{timeAgo(order.created_at)}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded-full text-[11px] font-semibold capitalize"
              style={{ background: statusColors.bg, color: statusColors.text }}>{order.status}</span>
            <button onClick={onClose} className="p-1.5 rounded-lg text-[#8892A4] hover:text-[#E4F0F6]"><X size={16} /></button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* customer */}
          <div className="bg-[#111111] rounded-xl p-4 space-y-2">
            <p className="text-[#8892A4] text-xs font-semibold uppercase tracking-wide">Customer</p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: `linear-gradient(135deg, ${platformColor(order.contact?.platform ?? 'whatsapp')}aa, ${platformColor(order.contact?.platform ?? 'whatsapp')}44)` }}>
                {getInitials(order.contact?.name ?? '?')}
              </div>
              <div>
                <p className="text-[#E4F0F6] text-sm font-semibold">{order.contact?.name ?? 'Unknown'}</p>
                {order.contact?.phone && <p className="text-[#8892A4] text-xs">{order.contact.phone}</p>}
              </div>
            </div>
          </div>

          {/* items */}
          <div className="bg-[#111111] rounded-xl p-4 space-y-3">
            <p className="text-[#8892A4] text-xs font-semibold uppercase tracking-wide">Items</p>
            {items.length === 0 ? (
              <p className="text-[#8892A4] text-sm">No items recorded</p>
            ) : (
              <div className="space-y-2">
                {items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <div>
                      <span className="text-[#E4F0F6]">{item.name}</span>
                      <span className="text-[#8892A4] ml-1">× {item.quantity}</span>
                    </div>
                    <span className="text-[#E4F0F6] font-semibold">{fmt(item.quantity * item.unit_price)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2 border-t border-[#1a2400] text-sm font-bold">
                  <span className="text-[#8892A4]">Total</span>
                  <span className="text-[#E4F0F6]">{fmt(order.amount)}</span>
                </div>
              </div>
            )}
          </div>

          {/* payment */}
          <div className="bg-[#111111] rounded-xl p-4 space-y-3">
            <p className="text-[#8892A4] text-xs font-semibold uppercase tracking-wide">Payment</p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#8892A4]">Method</span>
              <span className="text-[#E4F0F6] capitalize">{order.payment_method ?? 'Cash'}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#8892A4]">Status</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize"
                style={{ background: payColors.bg, color: payColors.text }}>{order.payment_status ?? 'unpaid'}</span>
            </div>
            {(order.payment_status ?? 'unpaid') !== 'paid' && (
              <button onClick={markPaid} disabled={updating}
                className="w-full py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg, #00D97E, #00b568)' }}>
                Mark as Paid
              </button>
            )}
          </div>

          {/* delivery */}
          {order.delivery_address && (
            <div className="bg-[#111111] rounded-xl p-4 space-y-2">
              <p className="text-[#8892A4] text-xs font-semibold uppercase tracking-wide">Delivery</p>
              <p className="text-[#E4F0F6] text-sm">{order.delivery_address}</p>
              {order.driver && <p className="text-[#8892A4] text-xs">Driver: {order.driver}</p>}
            </div>
          )}

          {/* timeline */}
          <div className="bg-[#111111] rounded-xl p-4">
            <p className="text-[#8892A4] text-xs font-semibold uppercase tracking-wide mb-4">Timeline</p>
            <div className="flex items-center gap-0">
              {STEPS.map((step, i) => {
                const done = i <= currentStep
                const isCancelled = order.status === 'cancelled'
                return (
                  <div key={step} className="flex-1 flex items-center">
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                        isCancelled ? 'bg-[#ef444430] text-[#ef4444]' : done ? 'bg-[#8729A0] text-white' : 'bg-[#1a2400] text-[#8892A4]'
                      }`}>{done && !isCancelled ? '✓' : i + 1}</div>
                      <span className={`text-[9px] capitalize text-center ${done && !isCancelled ? 'text-[#E4F0F6]' : 'text-[#8892A4]'}`}>{step}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`h-px flex-1 mx-1 mb-4 ${i < currentStep && !isCancelled ? 'bg-[#8729A0]' : 'bg-[#1a2400]'}`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* actions */}
          {order.status !== 'delivered' && order.status !== 'cancelled' && (
            <div className="grid grid-cols-2 gap-2">
              {order.status !== 'confirmed' && (
                <button onClick={() => updateStatus('confirmed')} disabled={updating}
                  className="py-2.5 rounded-xl text-sm font-semibold text-[#1877F2] border border-[#1877F2]/40 hover:bg-[#1877F2]/10 transition-all disabled:opacity-40">
                  Confirm
                </button>
              )}
              {order.status === 'confirmed' && (
                <button onClick={() => updateStatus('preparing')} disabled={updating}
                  className="py-2.5 rounded-xl text-sm font-semibold text-[#ff6b00] border border-[#ff6b00]/40 hover:bg-[#ff6b00]/10 transition-all disabled:opacity-40">
                  Preparing
                </button>
              )}
              <button onClick={() => updateStatus('delivered')} disabled={updating}
                className="py-2.5 rounded-xl text-sm font-semibold text-[#00D97E] border border-[#00D97E]/40 hover:bg-[#00D97E]/10 transition-all disabled:opacity-40">
                Delivered
              </button>
              <button onClick={() => {
                if (!confirm('Cancel this order?')) return
                updateStatus('cancelled')
              }} disabled={updating}
                className="col-span-2 py-2.5 rounded-xl text-sm font-semibold text-[#ef4444] border border-[#ef4444]/30 hover:bg-[#ef4444]/10 transition-all disabled:opacity-40">
                Cancel Order
              </button>
            </div>
          )}

          {/* notes */}
          {order.notes && (
            <div className="bg-[#111111] rounded-xl p-4">
              <p className="text-[#8892A4] text-xs font-semibold uppercase tracking-wide mb-2">Notes</p>
              <p className="text-[#E4F0F6] text-sm">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── main view ─────────────────────────────────────────────────────────────────
export default function OrdersView({ orders: initialOrders, stats, businessId }: Props) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showNewModal, setShowNewModal] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const filtered = orders.filter((o) => {
    const name = (o.contact?.name ?? '').toLowerCase()
    const num  = o.order_number.toLowerCase()
    const q    = search.toLowerCase()
    if (q && !name.includes(q) && !num.includes(q)) return false
    if (statusFilter !== 'all' && o.status !== statusFilter) return false
    return true
  })

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this order? This cannot be undone.')) return
    const sb = createClient()
    const { error } = await sb.from('orders').delete().eq('id', id)
    if (error) { toast.error('Delete failed'); return }
    setOrders(prev => prev.filter(o => o.id !== id))
    if (selectedOrder?.id === id) setSelectedOrder(null)
    toast.success('Order deleted')
  }

  const statCards = [
    { label: 'Total Orders', value: stats.total, color: '#E4F0F6' },
    { label: 'Pending',       value: stats.pending, color: '#F0A500' },
    { label: 'Delivered',     value: stats.delivered, color: '#00D97E' },
    { label: 'Revenue',       value: fmt(stats.revenue), color: '#8729A0' },
  ]

  return (
    <div className="space-y-5">
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#E4F0F6] text-xl font-bold">Orders</h1>
          <p className="text-[#8892A4] text-sm mt-0.5">{stats.total} total orders</p>
        </div>
        <button onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold"
          style={{ background: 'linear-gradient(135deg, #8729A0, #6a1f80)' }}>
          <Plus size={15} /> New Order
        </button>
      </div>

      {/* stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((s) => (
          <div key={s.label} className="bg-[#0A1200] border border-[#1a2400] rounded-xl p-4">
            <p className="text-[#8892A4] text-xs">{s.label}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8892A4]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or order #…"
            className="w-full bg-[#0A1200] border border-[#1a2400] rounded-lg pl-8 pr-3 py-2.5 text-sm text-[#E4F0F6] placeholder:text-[#8892A4] outline-none focus:border-[#8729A0]/50" />
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0A1200] border border-[#1a2400] rounded-lg px-3 py-2.5 text-sm text-[#E4F0F6] outline-none focus:border-[#8729A0]/50 pr-8 appearance-none">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8892A4] pointer-events-none" />
        </div>
      </div>

      {/* table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-[#8892A4] bg-[#0A1200] border border-[#1a2400] rounded-xl">
          <ShoppingBag size={40} strokeWidth={1} />
          <div className="text-center">
            <p className="font-semibold text-[#E4F0F6]">No orders yet</p>
            <p className="text-sm mt-1">Create your first order to get started</p>
          </div>
          <button onClick={() => setShowNewModal(true)}
            className="px-4 py-2.5 rounded-xl text-white text-sm font-semibold"
            style={{ background: 'linear-gradient(135deg, #8729A0, #6a1f80)' }}>
            <Plus size={14} className="inline mr-1.5" />New Order
          </button>
        </div>
      ) : (
        <div className="bg-[#0A1200] border border-[#1a2400] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1a2400]">
                  {['Order #', 'Customer', 'Amount', 'Payment', 'Status', 'Date', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[#8892A4] text-xs font-semibold uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a2400]/60">
                {filtered.map((order) => {
                  const payC = PAY_COLORS[order.payment_status ?? 'unpaid'] ?? PAY_COLORS.unpaid
                  const sC   = STATUS_COLORS[order.status] ?? { bg: '#8892A420', text: '#8892A4' }
                  return (
                    <tr key={order.id} onClick={() => setSelectedOrder(order)}
                      className="hover:bg-white/[0.02] cursor-pointer transition-colors">
                      <td className="px-4 py-3.5 font-mono text-[#8892A4] text-sm">{order.order_number}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold"
                            style={{ background: `linear-gradient(135deg, ${platformColor(order.contact?.platform ?? 'whatsapp')}aa, ${platformColor(order.contact?.platform ?? 'whatsapp')}44)` }}>
                            {getInitials(order.contact?.name ?? '?')}
                          </div>
                          <span className="text-[#E4F0F6] text-sm">{order.contact?.name ?? '—'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-[#E4F0F6] font-semibold text-sm">{fmt(order.amount)}</td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize"
                          style={{ background: payC.bg, color: payC.text }}>{order.payment_status ?? 'unpaid'}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize"
                          style={{ background: sC.bg, color: sC.text }}>{order.status}</span>
                      </td>
                      <td className="px-4 py-3.5 text-[#8892A4] text-xs">{timeAgo(order.created_at)}</td>
                      <td className="px-4 py-3.5">
                        <div className="relative">
                          <button onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === order.id ? null : order.id) }}
                            className="p-1.5 rounded-lg text-[#8892A4] hover:text-[#E4F0F6] hover:bg-white/[0.04]">
                            <MoreHorizontal size={15} />
                          </button>
                          {openMenu === order.id && (
                            <div className="absolute right-0 top-full mt-1 w-36 bg-[#0A1200] border border-[#1a2400] rounded-xl overflow-hidden z-10 shadow-xl">
                              <button onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); setOpenMenu(null) }}
                                className="w-full text-left px-3 py-2.5 text-sm text-[#E4F0F6] hover:bg-white/[0.04]">View</button>
                              <button onClick={(e) => { e.stopPropagation(); handleDelete(order.id); setOpenMenu(null) }}
                                className="w-full text-left px-3 py-2.5 text-sm text-[#ef4444] hover:bg-[#ef4444]/10">Delete</button>
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

      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={(updated) => {
            setOrders(prev => prev.map(o => o.id === updated.id ? updated : o))
            setSelectedOrder(updated)
          }}
        />
      )}
      {showNewModal && (
        <NewOrderModal
          businessId={businessId}
          onClose={() => setShowNewModal(false)}
          onCreated={(o) => setOrders(prev => [o, ...prev])}
        />
      )}
    </div>
  )
}
