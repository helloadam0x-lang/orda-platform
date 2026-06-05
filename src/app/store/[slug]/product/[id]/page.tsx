'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, ShoppingBag, MessageSquare, Minus, Plus } from 'lucide-react'
import { formatCurrency } from '@/lib/format'

export default function ProductDetailPage() {
  const { slug, id } = useParams<{ slug: string; id: string }>()
  const router = useRouter()
  const supabase = createClient()
  const [product, setProduct] = useState<any>(null)
  const [business, setBusiness] = useState<any>(null)
  const [currency, setCurrency] = useState('USD')
  const [quantity, setQuantity] = useState(1)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('products').select('*').eq('id', id).single(),
      supabase.from('businesses').select('id, name, slug, currency, whatsapp_phone').eq('slug', slug).single(),
    ]).then(([{ data: p }, { data: b }]) => {
      if (p) setProduct(p)
      if (b) { setBusiness(b); setCurrency(b.currency ?? 'USD') }
      setLoading(false)
    })
  }, [id, slug])

  function orderViaWhatsApp() {
    if (!business?.whatsapp_phone) return
    const variantText = Object.entries(selectedVariants).map(([k, v]) => `${k}: ${v}`).join(', ')
    const msg = `Hi! I'd like to order:\n\n*${product.name}*${variantText ? `\n${variantText}` : ''}\nQty: ${quantity}\nTotal: ${formatCurrency(product.price * quantity, currency)}\n\nPlease confirm my order.`
    window.open(`https://wa.me/${business.whatsapp_phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '60px 20px' }}>
        <div style={{ height: 350, background: '#f0f0f0', borderRadius: 16, marginBottom: 24, animation: 'shimmer 1.4s linear infinite' }} />
        <div style={{ height: 32, width: 280, background: '#f0f0f0', borderRadius: 8, marginBottom: 12 }} />
        <div style={{ height: 24, width: 100, background: '#f0f0f0', borderRadius: 8 }} />
      </div>
    </div>
  )

  if (!product) return <div style={{ padding: 40, textAlign: 'center', color: '#999', fontFamily: "'DM Sans', sans-serif" }}>Product not found</div>

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#FAFAF8', minHeight: '100vh', color: '#1a1a1a' }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <header style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.07)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 20px', height: 56, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#666', fontFamily: 'inherit' }}>
            ← Back
          </button>
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 18, color: '#111' }}>{business?.name}</div>
        </div>
      </header>

      <main style={{ maxWidth: 700, margin: '0 auto', padding: '32px 20px 60px' }}>
        {/* Image */}
        <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.07)', marginBottom: 28, aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {product.image_url
            ? <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ fontSize: 80 }}>📦</span>}
        </div>

        {/* Info */}
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 28, color: '#111', marginBottom: 10 }}>{product.name}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <span style={{ fontSize: 24, fontWeight: 800, color: '#D4A853' }}>{formatCurrency(product.price, currency)}</span>
          {product.compare_at_price && <span style={{ fontSize: 16, color: '#bbb', textDecoration: 'line-through' }}>{formatCurrency(product.compare_at_price, currency)}</span>}
        </div>
        {product.description && <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7, marginBottom: 24 }}>{product.description}</p>}

        {/* Variants */}
        {(product.variants ?? []).map((v: any) => (
          <div key={v.name} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>{v.name}</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {v.options.map((opt: string) => (
                <button
                  key={opt}
                  onClick={() => setSelectedVariants(prev => ({ ...prev, [v.name]: opt }))}
                  style={{
                    padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 150ms',
                    background: selectedVariants[v.name] === opt ? '#111' : '#fff',
                    color: selectedVariants[v.name] === opt ? '#fff' : '#333',
                    border: `2px solid ${selectedVariants[v.name] === opt ? '#111' : 'rgba(0,0,0,0.12)'}`,
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Quantity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Quantity</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 10, padding: '6px 12px' }}>
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#333', padding: 4 }}>−</button>
            <span style={{ fontSize: 15, fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#333', padding: 4 }}>+</button>
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#D4A853', marginLeft: 'auto' }}>{formatCurrency(product.price * quantity, currency)}</span>
        </div>

        {/* CTA */}
        {business?.whatsapp_phone ? (
          <button
            onClick={orderViaWhatsApp}
            style={{ width: '100%', padding: '16px 24px', background: '#25D366', color: '#fff', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)' }}
            onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
          >
            💬 Order via WhatsApp
          </button>
        ) : (
          <a
            href={`/store/${slug}`}
            style={{ display: 'block', width: '100%', padding: '16px 24px', background: '#D4A853', color: '#fff', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}
          >
            Back to Store
          </a>
        )}
      </main>
    </div>
  )
}
