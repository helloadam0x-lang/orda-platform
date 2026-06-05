'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Search, Plus, Minus, Trash2, Check, Monitor } from 'lucide-react'
import { formatCurrency } from '@/lib/format'

interface Product {
  id: string
  name: string
  price: number
  category: string | null
  image_url: string | null
  stock: number | null
}

interface CartItem extends Product {
  quantity: number
}

const PAYMENT_METHODS = [
  { id: 'cash', label: 'Cash' },
  { id: 'mtn', label: 'MTN MoMo' },
  { id: 'airtel', label: 'Airtel Money' },
  { id: 'card', label: 'Card' },
]

export default function POSPage() {
  const router = useRouter()
  const supabase = createClient()
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [currency, setCurrency] = useState('USD')
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [search, setSearch] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [discount, setDiscount] = useState(0)
  const [completing, setCompleting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/sign-in'); return }
      supabase.from('businesses').select('id, currency').eq('user_id', user.id).single()
        .then(({ data: biz }) => {
          if (biz) {
            setBusinessId(biz.id)
            setCurrency(biz.currency ?? 'USD')
            supabase.from('products').select('id, name, price, category, image_url, stock')
              .eq('business_id', biz.id).eq('is_active', true)
              .then(({ data: prods }) => setProducts((prods as Product[]) ?? []))
          }
        })
    })
  }, [])

  const filtered = products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category ?? '').toLowerCase().includes(search.toLowerCase())
  )

  function addToCart(product: Product) {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  function updateQty(id: string, delta: number) {
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter(i => i.quantity > 0))
  }

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)
  const discountAmt = subtotal * (discount / 100)
  const total = Math.max(0, subtotal - discountAmt)

  async function completeSale() {
    if (cart.length === 0 || !businessId) return
    setCompleting(true)
    await supabase.from('pos_transactions').insert({
      business_id: businessId,
      items: cart.map(i => ({ product_id: i.id, name: i.name, quantity: i.quantity, price: i.price })),
      subtotal, discount_amount: discountAmt, total,
      payment_method: paymentMethod,
      customer_name: customerName || null,
      customer_phone: customerPhone || null,
    })
    setCart([])
    setCustomerName('')
    setCustomerPhone('')
    setDiscount(0)
    setCompleting(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2500)
  }

  return (
    <div className="flex h-full overflow-hidden" style={{ background: 'var(--void)' }}>
      {/* Products grid */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full pl-8 pr-3 py-2.5 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-2)] text-[var(--text-1)] placeholder:text-[var(--text-3)] outline-none"
              style={{ border: '1px solid var(--border)' }}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-[var(--text-3)] text-[13px]">
              <Monitor size={24} className="mb-2 opacity-30" />
              No products
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.map(p => (
                <button
                  key={p.id}
                  onClick={() => addToCart(p)}
                  className="rounded-[var(--r-lg)] p-4 text-left transition-all duration-150 hover:scale-[1.01]"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
                  onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)' }}
                  onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
                >
                  <div className="w-full aspect-square rounded-[var(--r-md)] mb-3 flex items-center justify-center text-2xl" style={{ background: 'var(--surface-3)' }}>
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover rounded-[var(--r-md)]" />
                    ) : '📦'}
                  </div>
                  <div className="text-[13px] font-semibold text-[var(--text-1)] truncate">{p.name}</div>
                  <div className="text-[12px] font-bold mt-1" style={{ color: 'var(--accent)' }}>{formatCurrency(p.price, currency)}</div>
                  {p.stock !== null && <div className="text-[11px] text-[var(--text-3)] mt-0.5">{p.stock} left</div>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart */}
      <div
        className="w-80 shrink-0 flex flex-col h-full"
        style={{ borderLeft: '1px solid var(--border)', background: 'var(--surface-1)' }}
      >
        <div className="p-4 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="text-[14px] font-semibold text-[var(--text-1)]">Cart {cart.length > 0 && `(${cart.reduce((s, i) => s + i.quantity, 0)})`}</div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cart.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-[var(--text-3)] text-[13px]">Empty</div>
          ) : cart.map(item => (
            <div
              key={item.id}
              className="flex items-center gap-2 p-2.5 rounded-[var(--r-md)]"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
            >
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-[var(--text-1)] truncate">{item.name}</div>
                <div className="text-[12px]" style={{ color: 'var(--accent)' }}>{formatCurrency(item.price * item.quantity, currency)}</div>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded flex items-center justify-center text-[var(--text-3)] hover:text-[var(--text-1)]" style={{ background: 'var(--surface-3)' }}>
                  <Minus size={11} />
                </button>
                <span className="text-[13px] w-4 text-center text-[var(--text-1)]">{item.quantity}</span>
                <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded flex items-center justify-center text-[var(--text-3)] hover:text-[var(--text-1)]" style={{ background: 'var(--surface-3)' }}>
                  <Plus size={11} />
                </button>
                <button onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))} className="ml-1 text-[var(--text-3)] hover:text-[var(--error)]">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 space-y-3 shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
          {/* Customer (optional) */}
          <input
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
            placeholder="Customer name (optional)"
            className="w-full px-3 py-2 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-3)] text-[var(--text-1)] placeholder:text-[var(--text-3)] outline-none"
            style={{ border: '1px solid var(--border)' }}
          />

          {/* Discount */}
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-[var(--text-3)] shrink-0">Discount %</span>
            <input
              type="number"
              min={0}
              max={100}
              value={discount}
              onChange={e => setDiscount(Number(e.target.value))}
              className="flex-1 px-3 py-2 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-3)] text-[var(--text-1)] outline-none"
              style={{ border: '1px solid var(--border)' }}
            />
          </div>

          {/* Total */}
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[var(--text-2)]">Total</span>
            <span className="font-['Playfair_Display'] font-black text-xl" style={{ color: 'var(--accent)' }}>{formatCurrency(total, currency)}</span>
          </div>

          {/* Payment method */}
          <div className="grid grid-cols-2 gap-1.5">
            {PAYMENT_METHODS.map(pm => (
              <button
                key={pm.id}
                onClick={() => setPaymentMethod(pm.id)}
                className="py-1.5 rounded-[var(--r-sm)] text-[11px] font-medium transition-all duration-150"
                style={{
                  background: paymentMethod === pm.id ? 'var(--accent-dim)' : 'var(--surface-3)',
                  border: `1px solid ${paymentMethod === pm.id ? 'var(--accent-border)' : 'var(--border)'}`,
                  color: paymentMethod === pm.id ? 'var(--accent)' : 'var(--text-2)',
                }}
              >
                {pm.label}
              </button>
            ))}
          </div>

          <button
            onClick={completeSale}
            disabled={cart.length === 0 || completing}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-[var(--r-md)] text-[13px] font-semibold transition-all duration-150 disabled:opacity-40"
            style={{ background: success ? 'var(--success)' : 'var(--accent)', color: success ? '#fff' : 'var(--void)' }}
            onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)' }}
            onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
          >
            {success ? <><Check size={14} /> Sale Complete!</> : completing ? 'Processing…' : 'Complete Sale'}
          </button>
        </div>
      </div>
    </div>
  )
}
