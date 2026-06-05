'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft } from 'lucide-react'

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = createClient()
  const [product, setProduct] = useState<any>(null)
  const [currency, setCurrency] = useState('USD')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/sign-in'); return }
      supabase.from('businesses').select('currency').eq('user_id', user.id).single()
        .then(({ data: biz }) => { if (biz) setCurrency(biz.currency ?? 'USD') })
    })
    supabase.from('products').select('*').eq('id', id).single()
      .then(({ data }) => { if (data) setProduct(data) })
  }, [id])

  async function save() {
    if (!product) return
    setSaving(true)
    await supabase.from('products').update({
      name: product.name, description: product.description, price: Number(product.price),
      compare_at_price: product.compare_at_price ? Number(product.compare_at_price) : null,
      category: product.category, track_stock: product.track_stock,
      stock: product.track_stock ? Number(product.stock) : null,
      is_featured: product.is_featured, on_sale: product.on_sale,
    }).eq('id', id)
    router.push('/dashboard/store')
  }

  if (!product) return <div className="p-6"><div className="h-64 skeleton rounded-[var(--r-xl)]" /></div>

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-[13px] text-[var(--text-3)] hover:text-[var(--text-1)]">
        <ArrowLeft size={14} /> Back
      </button>
      <h1 className="font-['Playfair_Display'] font-black text-2xl text-[var(--text-1)]">Edit Product</h1>

      <div className="rounded-[var(--r-xl)] p-5 space-y-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
        {[
          { label: 'Name', key: 'name', type: 'input' },
          { label: 'Description', key: 'description', type: 'textarea' },
          { label: 'Category', key: 'category', type: 'input' },
        ].map(f => (
          <div key={f.key}>
            <label className="text-[12px] uppercase tracking-wide text-[var(--text-3)] mb-1.5 block">{f.label}</label>
            {f.type === 'input' ? (
              <input value={product[f.key] ?? ''} onChange={e => setProduct((p: any) => ({ ...p, [f.key]: e.target.value }))} className="w-full px-3 py-2.5 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-3)] text-[var(--text-1)] outline-none" style={{ border: '1px solid var(--border)' }} />
            ) : (
              <textarea value={product[f.key] ?? ''} onChange={e => setProduct((p: any) => ({ ...p, [f.key]: e.target.value }))} rows={3} className="w-full px-3 py-2.5 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-3)] text-[var(--text-1)] outline-none resize-none" style={{ border: '1px solid var(--border)' }} />
            )}
          </div>
        ))}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[12px] uppercase tracking-wide text-[var(--text-3)] mb-1.5 block">Price ({currency})</label>
            <input type="number" value={product.price ?? ''} onChange={e => setProduct((p: any) => ({ ...p, price: e.target.value }))} className="w-full px-3 py-2.5 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-3)] text-[var(--text-1)] outline-none" style={{ border: '1px solid var(--border)' }} />
          </div>
          <div>
            <label className="text-[12px] uppercase tracking-wide text-[var(--text-3)] mb-1.5 block">Compare At</label>
            <input type="number" value={product.compare_at_price ?? ''} onChange={e => setProduct((p: any) => ({ ...p, compare_at_price: e.target.value }))} className="w-full px-3 py-2.5 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-3)] text-[var(--text-1)] outline-none" style={{ border: '1px solid var(--border)' }} />
          </div>
        </div>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="w-full py-3 rounded-[var(--r-lg)] text-[14px] font-semibold transition-all duration-150 disabled:opacity-40"
        style={{ background: 'var(--accent)', color: 'var(--void)' }}
        onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)' }}
        onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
      >
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </div>
  )
}
