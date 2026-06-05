import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { formatCurrency } from '@/lib/format'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = createClient()
  const { data } = await supabase.rpc('get_store_data', { p_slug: params.slug }).single()
  if (!data) return { title: 'Store' }
  const b = data as any
  return {
    title: `${b.name} — Shop Online`,
    description: b.tagline ?? `Shop from ${b.name} on Orda`,
  }
}

export default async function StorePage({ params }: { params: { slug: string } }) {
  const supabase = createClient()
  const { data } = await supabase.rpc('get_store_data', { p_slug: params.slug }).single()
  if (!data) notFound()

  const b = data as any
  const products = (b.products ?? []) as any[]
  const zones = (b.delivery_zones ?? []) as any[]
  const currency = b.currency ?? 'USD'
  const waLink = b.whatsapp_phone ? `https://wa.me/${b.whatsapp_phone.replace(/\D/g, '')}` : null

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#FAFAF8', minHeight: '100vh', color: '#1a1a1a' }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Announcement */}
      {b.announcement_active && b.announcement_text && (
        <div style={{ background: '#111', color: '#D4A853', textAlign: 'center', padding: '10px 16px', fontSize: 13, fontWeight: 600 }}>
          {b.announcement_text}
        </div>
      )}

      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.07)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 20, color: '#111' }}>{b.name}</div>
          {waLink && (
            <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#25D366', color: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
              💬 WhatsApp
            </a>
          )}
        </div>
      </header>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#1a1a1a 0%,#2d2d2d 100%)', padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          {b.logo_url && <img src={b.logo_url} alt={b.name} style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', marginBottom: 16, border: '3px solid #D4A853' }} />}
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(28px,5vw,44px)', color: '#F0F0F0', marginBottom: 12 }}>{b.name}</h1>
          {b.tagline && <p style={{ fontSize: 16, color: 'rgba(240,240,240,0.6)', marginBottom: 20 }}>{b.tagline}</p>}
          {b.city && <div style={{ fontSize: 13, color: 'rgba(240,240,240,0.4)' }}>📍 {b.city}</div>}
        </div>
      </div>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px' }}>
        {/* Products */}
        {products.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 26, color: '#111', marginBottom: 24 }}>Products</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
              {products.filter((p: any) => p.is_active).map((p: any) => (
                <a
                  key={p.id}
                  href={`/store/${params.slug}/product/${p.id}`}
                  style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.07)', overflow: 'hidden', textDecoration: 'none', color: 'inherit', display: 'block', transition: 'box-shadow 200ms' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = '' }}
                >
                  <div style={{ aspectRatio: '4/3', background: '#f5f5f3', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {p.image_url
                      ? <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: 48 }}>📦</span>}
                  </div>
                  <div style={{ padding: '12px 14px 14px' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 4 }}>{p.name}</div>
                    {p.description && <div style={{ fontSize: 12, color: '#666', marginBottom: 8, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</div>}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: '#D4A853' }}>{formatCurrency(p.price, currency)}</div>
                        {p.compare_at_price && <div style={{ fontSize: 12, color: '#bbb', textDecoration: 'line-through' }}>{formatCurrency(p.compare_at_price, currency)}</div>}
                      </div>
                      {p.track_stock && p.stock === 0 && <div style={{ fontSize: 11, color: '#EF4444', fontWeight: 600 }}>Out of stock</div>}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Delivery zones */}
        {zones.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 26, color: '#111', marginBottom: 16 }}>Delivery</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {zones.filter((z: any) => z.is_active).map((z: any) => (
                <div key={z.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid rgba(0,0,0,0.07)', padding: '12px 14px' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>{z.name}</div>
                  <div style={{ fontSize: 12, color: '#D4A853', marginTop: 2, fontWeight: 600 }}>{formatCurrency(z.fee, currency)}</div>
                  {z.estimated_time && <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>~{z.estimated_time}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* WhatsApp CTA */}
        {waLink && (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: '#fff', borderRadius: 20, border: '1px solid rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: 20, fontWeight: 900, fontFamily: "'Playfair Display', serif", color: '#111', marginBottom: 10 }}>Order via WhatsApp</div>
            <p style={{ fontSize: 14, color: '#666', marginBottom: 20 }}>Chat with us directly to place your order or ask any questions.</p>
            <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: '#25D366', color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
              💬 Chat on WhatsApp
            </a>
          </div>
        )}
      </main>

      <footer style={{ textAlign: 'center', padding: '28px 20px', borderTop: '1px solid rgba(0,0,0,0.07)', marginTop: 40 }}>
        <div style={{ fontSize: 12, color: '#bbb', marginBottom: 8 }}>
          Powered by <a href="https://getorda.app" style={{ color: '#D4A853' }}>Orda</a> · <a href="/privacy" style={{ color: '#bbb' }}>Privacy</a> · <a href="#" style={{ color: '#bbb' }}>Type STOP to unsubscribe</a>
        </div>
      </footer>
    </div>
  )
}
