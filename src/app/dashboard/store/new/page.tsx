'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Plus, Trash2, Upload } from 'lucide-react'

export default function NewProductPage() {
  const router = useRouter()
  const supabase = createClient()
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [currency, setCurrency] = useState('USD')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [comparePrice, setComparePrice] = useState('')
  const [category, setCategory] = useState('')
  const [stock, setStock] = useState('')
  const [trackStock, setTrackStock] = useState(false)
  const [isFeatured, setIsFeatured] = useState(false)
  const [onSale, setOnSale] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [variants, setVariants] = useState<{ name: string; options: string }[]>([])
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/sign-in'); return }
      supabase.from('businesses').select('id, currency').eq('user_id', user.id).single()
        .then(({ data: biz }) => { if (biz) { setBusinessId(biz.id); setCurrency(biz.currency ?? 'USD') } })
    })
  }, [])

  async function uploadImage(file: File) {
    if (!businessId) return
    setUploading(true)
    const path = `${businessId}/${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage.from('product-images').upload(path, file)
    if (!error && data) {
      const { data: url } = supabase.storage.from('product-images').getPublicUrl(data.path)
      setImageUrl(url.publicUrl)
    }
    setUploading(false)
  }

  async function save() {
    if (!name || !price || !businessId) return
    setSaving(true)
    await supabase.from('products').insert({
      business_id: businessId,
      name, description: description || null, price: Number(price),
      compare_at_price: comparePrice ? Number(comparePrice) : null,
      category: category || null, image_url: imageUrl,
      track_stock: trackStock, stock: trackStock ? Number(stock) : null,
      is_featured: isFeatured, on_sale: onSale, is_active: true,
      variants: variants.filter(v => v.name && v.options).map(v => ({
        name: v.name, options: v.options.split(',').map(o => o.trim()).filter(Boolean),
      })),
    })
    router.push('/dashboard/store')
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-[13px] text-[var(--text-3)] hover:text-[var(--text-1)]">
        <ArrowLeft size={14} /> Back
      </button>
      <h1 className="font-['Playfair_Display'] font-black text-2xl text-[var(--text-1)]">Add Product</h1>

      <div className="rounded-[var(--r-xl)] p-5 space-y-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
        {/* Image upload */}
        <div>
          <label className="text-[12px] uppercase tracking-wide text-[var(--text-3)] mb-1.5 block">Product Image</label>
          <label
            className="flex flex-col items-center justify-center w-full h-32 rounded-[var(--r-lg)] cursor-pointer transition-colors duration-150 hover:border-[var(--accent)]"
            style={{ background: 'var(--surface-3)', border: '2px dashed var(--border)' }}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="Preview" className="h-full w-full object-cover rounded-[var(--r-lg)]" />
            ) : uploading ? (
              <div className="text-[13px] text-[var(--text-3)]">Uploading…</div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-[var(--text-3)]">
                <Upload size={20} />
                <span className="text-[12px]">Click to upload</span>
              </div>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f) }} />
          </label>
        </div>

        {[
          { label: 'Product Name *', value: name, set: setName, type: 'input', placeholder: 'e.g. Ankara Dress' },
          { label: 'Description', value: description, set: setDescription, type: 'textarea', placeholder: 'Optional product description' },
          { label: 'Category', value: category, set: setCategory, type: 'input', placeholder: 'e.g. Clothing' },
        ].map(f => (
          <div key={f.label}>
            <label className="text-[12px] uppercase tracking-wide text-[var(--text-3)] mb-1.5 block">{f.label}</label>
            {f.type === 'input' ? (
              <input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} className="w-full px-3 py-2.5 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-3)] text-[var(--text-1)] placeholder:text-[var(--text-3)] outline-none" style={{ border: '1px solid var(--border)' }} />
            ) : (
              <textarea value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} rows={3} className="w-full px-3 py-2.5 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-3)] text-[var(--text-1)] placeholder:text-[var(--text-3)] outline-none resize-none" style={{ border: '1px solid var(--border)' }} />
            )}
          </div>
        ))}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[12px] uppercase tracking-wide text-[var(--text-3)] mb-1.5 block">Price * ({currency})</label>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" className="w-full px-3 py-2.5 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-3)] text-[var(--text-1)] outline-none" style={{ border: '1px solid var(--border)' }} />
          </div>
          <div>
            <label className="text-[12px] uppercase tracking-wide text-[var(--text-3)] mb-1.5 block">Compare At ({currency})</label>
            <input type="number" value={comparePrice} onChange={e => setComparePrice(e.target.value)} placeholder="0.00" className="w-full px-3 py-2.5 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-3)] text-[var(--text-1)] outline-none" style={{ border: '1px solid var(--border)' }} />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {[
            { label: 'Featured', val: isFeatured, set: setIsFeatured },
            { label: 'On Sale', val: onSale, set: setOnSale },
            { label: 'Track Stock', val: trackStock, set: setTrackStock },
          ].map(toggle => (
            <label key={toggle.label} className="flex items-center gap-2 cursor-pointer">
              <button
                type="button"
                onClick={() => toggle.set(!toggle.val)}
                className="w-9 h-5 rounded-full relative transition-colors duration-200"
                style={{ background: toggle.val ? 'var(--accent)' : 'var(--surface-3)' }}
              >
                <span className="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200" style={{ transform: toggle.val ? 'translateX(20px)' : 'translateX(2px)' }} />
              </button>
              <span className="text-[13px] text-[var(--text-2)]">{toggle.label}</span>
            </label>
          ))}
        </div>

        {trackStock && (
          <div>
            <label className="text-[12px] uppercase tracking-wide text-[var(--text-3)] mb-1.5 block">Stock Count</label>
            <input type="number" value={stock} onChange={e => setStock(e.target.value)} placeholder="0" className="w-32 px-3 py-2.5 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-3)] text-[var(--text-1)] outline-none" style={{ border: '1px solid var(--border)' }} />
          </div>
        )}

        {/* Variants */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[12px] uppercase tracking-wide text-[var(--text-3)]">Variants</label>
            <button onClick={() => setVariants(v => [...v, { name: '', options: '' }])} className="flex items-center gap-1 text-[12px] text-[var(--accent)]"><Plus size={12} /> Add</button>
          </div>
          {variants.map((v, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input value={v.name} onChange={e => setVariants(prev => prev.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} placeholder="Group (e.g. Size)" className="flex-1 px-3 py-2 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-3)] text-[var(--text-1)] outline-none" style={{ border: '1px solid var(--border)' }} />
              <input value={v.options} onChange={e => setVariants(prev => prev.map((x, j) => j === i ? { ...x, options: e.target.value } : x))} placeholder="Options (S, M, L)" className="flex-1 px-3 py-2 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-3)] text-[var(--text-1)] outline-none" style={{ border: '1px solid var(--border)' }} />
              <button onClick={() => setVariants(prev => prev.filter((_, j) => j !== i))} className="p-2 text-[var(--text-3)] hover:text-[var(--error)]"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={save}
        disabled={saving || !name || !price}
        className="w-full py-3 rounded-[var(--r-lg)] text-[14px] font-semibold transition-all duration-150 disabled:opacity-40"
        style={{ background: 'var(--accent)', color: 'var(--void)' }}
        onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)' }}
        onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
      >
        {saving ? 'Saving…' : 'Save Product'}
      </button>
    </div>
  )
}
