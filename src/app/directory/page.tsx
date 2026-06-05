import { createClient } from '@/lib/supabase/server'
import { Search } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DirectoryPage({ searchParams }: { searchParams: { q?: string; type?: string; city?: string } }) {
  const supabase = createClient()

  let q = supabase
    .from('businesses')
    .select('id, name, slug, business_type, city, country, tagline, logo_url, whatsapp_phone')
    .eq('is_active', true)
    .eq('store_active', true)
    .limit(60)

  if (searchParams.q) q = q.ilike('name', `%${searchParams.q}%`)
  if (searchParams.type) q = q.eq('business_type', searchParams.type)
  if (searchParams.city) q = q.ilike('city', `%${searchParams.city}%`)

  const { data: businesses } = await q

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#FAFAF8', minHeight: '100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <header style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.07)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 22, color: '#111', textDecoration: 'none' }}>
            ORDA<span style={{ color: '#D4A853' }}>.</span>
          </a>
          <a href="/sign-in" style={{ fontSize: 13, fontWeight: 600, color: '#D4A853', textDecoration: 'none' }}>Start Free →</a>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(32px,5vw,48px)', color: '#111', marginBottom: 12 }}>
            Business Directory
          </h1>
          <p style={{ fontSize: 15, color: '#666' }}>Discover businesses powered by Orda AI</p>
        </div>

        {/* Search */}
        <form method="get" style={{ display: 'flex', gap: 12, marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: 14 }}>🔍</span>
            <input
              name="q"
              defaultValue={searchParams.q ?? ''}
              placeholder="Search businesses…"
              style={{ width: '100%', padding: '12px 12px 12px 36px', borderRadius: 10, border: '1px solid rgba(0,0,0,0.12)', fontSize: 14, outline: 'none', background: '#fff' }}
            />
          </div>
          <button type="submit" style={{ padding: '12px 24px', background: '#D4A853', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            Search
          </button>
        </form>

        {/* Grid */}
        {!businesses || businesses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
            No businesses found
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
            {businesses.map((b: any) => (
              <div
                key={b.id}
                style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.07)', overflow: 'hidden', transition: 'box-shadow 200ms', cursor: 'pointer' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '' }}
              >
                <div style={{ height: 80, background: 'linear-gradient(135deg,#D4A853,#A07830)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {b.logo_url
                    ? <img src={b.logo_url} alt={b.name} style={{ height: 56, width: 56, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.4)' }} />
                    : <span style={{ fontSize: 28, fontFamily: "'Playfair Display', serif", fontWeight: 900, color: '#fff' }}>{b.name?.[0]}</span>
                  }
                </div>
                <div style={{ padding: '16px 16px 12px' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>{b.name}</div>
                  <div style={{ fontSize: 12, color: '#D4A853', marginTop: 2, textTransform: 'capitalize' }}>{b.business_type?.replace(/_/g, ' ')}</div>
                  {b.city && <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>📍 {b.city}</div>}
                  {b.tagline && <div style={{ fontSize: 12, color: '#666', marginTop: 6, lineHeight: 1.5 }}>{b.tagline}</div>}
                  <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                    <a href={`/store/${b.slug}`} style={{ flex: 1, textAlign: 'center', padding: '8px 12px', background: '#111', color: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
                      Visit Store
                    </a>
                    {b.whatsapp_phone && (
                      <a href={`https://wa.me/${b.whatsapp_phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textAlign: 'center', padding: '8px 12px', background: '#25D366', color: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer style={{ textAlign: 'center', padding: '32px 20px', borderTop: '1px solid rgba(0,0,0,0.07)', fontSize: 12, color: '#bbb', marginTop: 40 }}>
        <a href="/" style={{ color: '#D4A853', textDecoration: 'none', fontWeight: 600 }}>ORDA</a> — WhatsApp AI for every business
      </footer>
    </div>
  )
}
