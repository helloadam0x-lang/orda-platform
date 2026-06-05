'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Plus, Store, Copy, ExternalLink, Edit2, Trash2, Eye, EyeOff, QrCode } from 'lucide-react'
import { formatCurrency } from '@/lib/format'

export default function StorePage() {
  const router = useRouter()
  const supabase = createClient()
  const [business, setBusiness] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [currency, setCurrency] = useState('USD')
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'products' | 'zones' | 'discounts' | 'settings' | 'qr'>('products')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/sign-in'); return }
      supabase.from('businesses').select('id, slug, name, currency, store_active, announcement_text, announcement_active')
        .eq('user_id', user.id).single()
        .then(({ data: biz }) => {
          if (!biz) { router.push('/onboarding'); return }
          setBusiness(biz)
          setCurrency(biz.currency ?? 'USD')
          supabase.from('products').select('*').eq('business_id', biz.id).order('created_at', { ascending: false })
            .then(({ data: prods }) => { setProducts(prods ?? []); setLoading(false) })
        })
    })
  }, [])

  const storeUrl = business ? `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://getorda.app'}/store/${business.slug}` : ''

  function copyUrl() {
    navigator.clipboard.writeText(storeUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function toggleProduct(id: string, current: boolean) {
    await supabase.from('products').update({ is_active: !current }).eq('id', id)
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: !current } : p))
  }

  async function deleteProduct(id: string) {
    if (!confirm('Delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-['Playfair_Display'] font-black text-2xl text-[var(--text-1)]">Store</h1>
          <p className="text-[13px] text-[var(--text-3)] mt-1">{products.length} products</p>
        </div>
        <button
          onClick={() => router.push('/dashboard/store/new')}
          className="flex items-center gap-2 px-4 py-2 rounded-[var(--r-md)] text-[13px] font-semibold transition-all duration-150"
          style={{ background: 'var(--accent)', color: 'var(--void)' }}
          onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)' }}
          onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
        >
          <Plus size={14} /> Add Product
        </button>
      </div>

      {/* Store URL card */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-[var(--r-lg)]"
        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
      >
        <Store size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
        <span className="flex-1 text-[13px] text-[var(--text-2)] truncate">{storeUrl}</span>
        <button onClick={copyUrl} className="text-[12px] font-medium px-3 py-1 rounded-[var(--r-sm)] transition-colors duration-150" style={{ color: copied ? 'var(--success)' : 'var(--accent)' }}>
          {copied ? 'Copied!' : <><Copy size={13} /></>}
        </button>
        <a href={storeUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-[var(--text-3)] hover:text-[var(--text-1)]">
          <ExternalLink size={14} />
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {(['products', 'zones', 'discounts', 'settings', 'qr'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 rounded-[var(--r-md)] text-[13px] font-medium capitalize whitespace-nowrap transition-colors duration-150"
            style={{ background: tab === t ? 'var(--accent)' : 'var(--surface-2)', color: tab === t ? 'var(--void)' : 'var(--text-2)', border: `1px solid ${tab === t ? 'var(--accent)' : 'var(--border)'}` }}
          >
            {t === 'qr' ? 'QR Code' : t === 'zones' ? 'Delivery Zones' : t}
          </button>
        ))}
      </div>

      {tab === 'products' && (
        loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-48 skeleton rounded-[var(--r-lg)]" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-[var(--text-3)]">
            <Store size={36} className="mb-3 opacity-30" />
            <div className="text-[14px] mb-4">No products yet</div>
            <button
              onClick={() => router.push('/dashboard/store/new')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-[var(--r-md)] text-[13px] font-semibold"
              style={{ background: 'var(--accent)', color: 'var(--void)' }}
            >
              <Plus size={14} /> Add First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(p => (
              <div
                key={p.id}
                className="rounded-[var(--r-lg)] overflow-hidden transition-all duration-150"
                style={{ background: 'var(--surface-2)', border: `1px solid ${p.is_active ? 'var(--border)' : 'rgba(255,255,255,0.04)'}`, opacity: p.is_active ? 1 : 0.5 }}
              >
                <div className="aspect-[4/3] flex items-center justify-center text-4xl" style={{ background: 'var(--surface-3)' }}>
                  {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" /> : '📦'}
                </div>
                <div className="p-3">
                  <div className="text-[13px] font-semibold text-[var(--text-1)] truncate">{p.name}</div>
                  <div className="text-[12px] font-bold mt-0.5" style={{ color: 'var(--accent)' }}>{formatCurrency(p.price, currency)}</div>
                  {p.track_stock && (
                    <div className="text-[11px] mt-0.5" style={{ color: (p.stock ?? 0) < 5 ? 'var(--warning)' : 'var(--text-3)' }}>
                      {p.stock ?? 0} in stock
                    </div>
                  )}
                  <div className="flex items-center gap-1 mt-3">
                    <button
                      onClick={() => router.push(`/dashboard/store/${p.id}/edit`)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-[var(--r-sm)] text-[11px] font-medium transition-colors duration-150"
                      style={{ background: 'var(--surface-3)', color: 'var(--text-2)' }}
                    >
                      <Edit2 size={11} /> Edit
                    </button>
                    <button
                      onClick={() => toggleProduct(p.id, p.is_active)}
                      className="p-1.5 rounded-[var(--r-sm)] transition-colors duration-150"
                      style={{ background: 'var(--surface-3)', color: p.is_active ? 'var(--success)' : 'var(--text-3)' }}
                    >
                      {p.is_active ? <Eye size={13} /> : <EyeOff size={13} />}
                    </button>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="p-1.5 rounded-[var(--r-sm)] transition-colors duration-150 hover:text-[var(--error)]"
                      style={{ background: 'var(--surface-3)', color: 'var(--text-3)' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'zones' && <DeliveryZonesTab businessId={business?.id} currency={currency} supabase={supabase} />}
      {tab === 'discounts' && <DiscountsTab businessId={business?.id} currency={currency} supabase={supabase} />}
      {tab === 'settings' && <StoreSettingsTab business={business} supabase={supabase} setBusiness={setBusiness} />}
      {tab === 'qr' && <QRTab storeUrl={storeUrl} businessName={business?.name} />}
    </div>
  )
}

function DeliveryZonesTab({ businessId, currency, supabase }: any) {
  const [zones, setZones] = useState<any[]>([])
  const [name, setName] = useState('')
  const [fee, setFee] = useState('')
  const [time, setTime] = useState('')

  useEffect(() => {
    if (!businessId) return
    supabase.from('delivery_zones').select('*').eq('business_id', businessId).then(({ data }: any) => setZones(data ?? []))
  }, [businessId])

  async function add() {
    if (!name || !fee) return
    const { data } = await supabase.from('delivery_zones').insert({ business_id: businessId, name, fee: Number(fee), estimated_time: time, is_active: true }).select().single()
    if (data) setZones(prev => [...prev, data])
    setName(''); setFee(''); setTime('')
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Zone name" className="flex-1 min-w-32 px-3 py-2 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-2)] text-[var(--text-1)] outline-none" style={{ border: '1px solid var(--border)' }} />
        <input value={fee} onChange={e => setFee(e.target.value)} type="number" placeholder="Fee" className="w-24 px-3 py-2 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-2)] text-[var(--text-1)] outline-none" style={{ border: '1px solid var(--border)' }} />
        <input value={time} onChange={e => setTime(e.target.value)} placeholder="Est. time" className="w-28 px-3 py-2 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-2)] text-[var(--text-1)] outline-none" style={{ border: '1px solid var(--border)' }} />
        <button onClick={add} className="px-4 py-2 rounded-[var(--r-md)] text-[13px] font-semibold" style={{ background: 'var(--accent)', color: 'var(--void)' }}>Add</button>
      </div>
      {zones.map(z => (
        <div key={z.id} className="flex items-center justify-between px-4 py-3 rounded-[var(--r-lg)]" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
          <div>
            <div className="text-[13px] font-semibold text-[var(--text-1)]">{z.name}</div>
            <div className="text-[12px] text-[var(--text-3)]">{formatCurrency(z.fee, currency)} · {z.estimated_time}</div>
          </div>
          <button onClick={async () => { await supabase.from('delivery_zones').delete().eq('id', z.id); setZones(prev => prev.filter(x => x.id !== z.id)) }} className="text-[var(--text-3)] hover:text-[var(--error)]"><Trash2 size={14} /></button>
        </div>
      ))}
    </div>
  )
}

function DiscountsTab({ businessId, currency, supabase }: any) {
  const [codes, setCodes] = useState<any[]>([])
  const [code, setCode] = useState('')
  const [type, setType] = useState<'percent' | 'fixed'>('percent')
  const [value, setValue] = useState('')
  const [minOrder, setMinOrder] = useState('')

  useEffect(() => {
    if (!businessId) return
    supabase.from('discount_codes').select('*').eq('business_id', businessId).then(({ data }: any) => setCodes(data ?? []))
  }, [businessId])

  async function add() {
    if (!code || !value) return
    const { data } = await supabase.from('discount_codes').insert({
      business_id: businessId, code: code.toUpperCase(), type, value: Number(value),
      min_order: minOrder ? Number(minOrder) : null, is_active: true,
    }).select().single()
    if (data) setCodes(prev => [...prev, data])
    setCode(''); setValue(''); setMinOrder('')
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <input value={code} onChange={e => setCode(e.target.value)} placeholder="CODE" className="w-28 px-3 py-2 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-2)] text-[var(--text-1)] outline-none uppercase" style={{ border: '1px solid var(--border)' }} />
        <select value={type} onChange={e => setType(e.target.value as any)} className="px-3 py-2 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-2)] text-[var(--text-1)] outline-none" style={{ border: '1px solid var(--border)' }}>
          <option value="percent">%</option>
          <option value="fixed">Fixed</option>
        </select>
        <input value={value} onChange={e => setValue(e.target.value)} type="number" placeholder="Value" className="w-20 px-3 py-2 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-2)] text-[var(--text-1)] outline-none" style={{ border: '1px solid var(--border)' }} />
        <input value={minOrder} onChange={e => setMinOrder(e.target.value)} type="number" placeholder="Min order" className="w-28 px-3 py-2 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-2)] text-[var(--text-1)] outline-none" style={{ border: '1px solid var(--border)' }} />
        <button onClick={add} className="px-4 py-2 rounded-[var(--r-md)] text-[13px] font-semibold" style={{ background: 'var(--accent)', color: 'var(--void)' }}>Add</button>
      </div>
      {codes.map(c => (
        <div key={c.id} className="flex items-center justify-between px-4 py-3 rounded-[var(--r-lg)]" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
          <div>
            <span className="text-[13px] font-bold" style={{ color: 'var(--accent)' }}>{c.code}</span>
            <span className="ml-2 text-[12px] text-[var(--text-2)]">{c.type === 'percent' ? `${c.value}% off` : `${formatCurrency(c.value, currency)} off`}</span>
          </div>
          <button onClick={async () => { await supabase.from('discount_codes').delete().eq('id', c.id); setCodes(prev => prev.filter(x => x.id !== c.id)) }} className="text-[var(--text-3)] hover:text-[var(--error)]"><Trash2 size={14} /></button>
        </div>
      ))}
    </div>
  )
}

function StoreSettingsTab({ business, supabase, setBusiness }: any) {
  async function save(patch: Record<string, any>) {
    await supabase.from('businesses').update(patch).eq('id', business?.id)
    setBusiness((b: any) => ({ ...b, ...patch }))
  }
  return (
    <div className="space-y-4 rounded-[var(--r-xl)] p-5" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between">
        <div><div className="text-[13px] font-semibold text-[var(--text-1)]">Store Active</div><div className="text-[12px] text-[var(--text-3)]">Customers can visit and order</div></div>
        <button onClick={() => save({ store_active: !business?.store_active })} className="w-10 h-5 rounded-full relative transition-colors duration-200" style={{ background: business?.store_active ? 'var(--accent)' : 'var(--surface-3)' }}>
          <span className="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200" style={{ transform: business?.store_active ? 'translateX(22px)' : 'translateX(2px)' }} />
        </button>
      </div>
      <div>
        <label className="text-[12px] uppercase tracking-wide text-[var(--text-3)] mb-1.5 block">Announcement Bar Text</label>
        <input defaultValue={business?.announcement_text ?? ''} onBlur={e => save({ announcement_text: e.target.value })} placeholder="Free delivery above UGX 50,000!" className="w-full px-3 py-2 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-3)] text-[var(--text-1)] outline-none" style={{ border: '1px solid var(--border)' }} />
      </div>
    </div>
  )
}

function QRTab({ storeUrl, businessName }: any) {
  const [qrUrl, setQrUrl] = useState<string | null>(null)
  useEffect(() => {
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(storeUrl)}`)
  }, [storeUrl])
  return (
    <div className="flex flex-col items-center space-y-4 py-8">
      <div className="p-4 bg-white rounded-[var(--r-lg)]">
        {qrUrl && <img src={qrUrl} alt="Store QR" className="w-48 h-48" />}
      </div>
      <div className="text-[13px] text-[var(--text-2)]">{storeUrl}</div>
      <a
        href={qrUrl ?? '#'}
        download={`${businessName ?? 'store'}-qr.png`}
        className="flex items-center gap-2 px-5 py-2.5 rounded-[var(--r-md)] text-[13px] font-semibold"
        style={{ background: 'var(--accent)', color: 'var(--void)' }}
      >
        <QrCode size={14} /> Download QR
      </a>
    </div>
  )
}
