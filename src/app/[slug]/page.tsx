import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { getTheme, themeToCSS } from '@/lib/websiteThemes'
import { formatCurrency } from '@/lib/format'

export const dynamic = 'force-dynamic'

// These slugs are reserved for top-level routes — skip this catch-all
const RESERVED_SLUGS = ['sign-in', 'sign-up', 'reset-password', 'dashboard', 'onboarding', 'track', 'store', 'staff', 'directory', 'join', 'api', 'privacy', 'terms', 'cookies', 'gdpr', '_next', 'favicon.ico']

export async function generateMetadata({ params }: { params: { slug: string } }) {
  if (RESERVED_SLUGS.includes(params.slug)) return {}
  const supabase = createClient()
  const { data } = await supabase.rpc('get_website_data', { p_slug: params.slug }).single()
  if (!data) return { title: 'Business' }
  const b = data as any
  return {
    title: b.website_config?.seo_title ?? `${b.name} — Official Website`,
    description: b.website_config?.seo_description ?? b.tagline,
  }
}

export default async function BusinessWebsitePage({ params }: { params: { slug: string } }) {
  if (RESERVED_SLUGS.includes(params.slug)) notFound()

  const supabase = createClient()
  const { data } = await supabase.rpc('get_website_data', { p_slug: params.slug }).single()

  if (!data) {
    // Try fallback to store
    const { data: biz } = await supabase.from('businesses').select('slug').eq('slug', params.slug).single()
    if (biz) redirect(`/store/${params.slug}`)
    notFound()
  }

  const b = data as any
  const wc = b.website_config ?? {}
  const sections = wc.sections_enabled ?? {}
  const theme = getTheme(wc.theme ?? 'luxe')
  const cssVars = themeToCSS(theme)
  const currency = b.currency ?? 'USD'
  const products = (b.products ?? []).filter((p: any) => p.is_active).slice(0, 8)
  const reviews = (b.reviews ?? []).slice(0, 6)
  const waLink = b.whatsapp_phone ? `https://wa.me/${b.whatsapp_phone.replace(/\D/g, '')}` : null

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: b.name,
    description: b.tagline ?? '',
    url: `https://getorda.app/${params.slug}`,
    telephone: b.whatsapp_phone ?? '',
    address: { '@type': 'PostalAddress', addressLocality: b.city ?? '', addressCountry: b.country ?? 'UG' },
  })

  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <style>{`:root{${cssVars}}`}</style>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      </head>
      <body style={{ background: 'var(--site-bg)', color: 'var(--site-text)', fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
        {/* Header */}
        <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--site-surface)', borderBottom: '1px solid var(--site-border)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 22, color: 'var(--site-text)' }}>{b.name}</div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <a href={`/store/${params.slug}`} style={{ fontSize: 13, fontWeight: 600, color: 'var(--site-text-2)', textDecoration: 'none' }}>Shop</a>
              {waLink && (
                <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ padding: '8px 16px', background: 'var(--site-accent)', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Hero */}
        <section style={{ padding: 'clamp(80px,10vw,140px) 20px', textAlign: 'center', background: 'var(--site-bg)', borderBottom: '1px solid var(--site-border)' }}>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            {b.logo_url && <img src={b.logo_url} alt={b.name} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 24, border: '3px solid var(--site-accent)' }} />}
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(36px,6vw,64px)', color: 'var(--site-text)', lineHeight: 1.1, marginBottom: 16 }}>
              {wc.hero_headline ?? b.name}
            </h1>
            <p style={{ fontSize: 18, color: 'var(--site-text-2)', maxWidth: 500, margin: '0 auto 32px', lineHeight: 1.6 }}>
              {wc.hero_subtext ?? b.tagline ?? ''}
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href={`/store/${params.slug}`} style={{ padding: '14px 28px', background: 'var(--site-accent)', color: '#fff', borderRadius: 'var(--site-radius)', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
                Shop Now →
              </a>
              {waLink && (
                <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ padding: '14px 28px', background: 'transparent', color: 'var(--site-text)', border: '2px solid var(--site-border)', borderRadius: 'var(--site-radius)', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
                  WhatsApp Us
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Products */}
        {sections.products !== false && products.length > 0 && (
          <section style={{ padding: 'clamp(60px,8vw,100px) 20px' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 36, color: 'var(--site-text)', marginBottom: 32, textAlign: 'center' }}>Our Products</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
                {products.map((p: any) => (
                  <a key={p.id} href={`/store/${params.slug}/product/${p.id}`} style={{ background: 'var(--site-surface)', borderRadius: 'var(--site-radius)', border: '1px solid var(--site-border)', overflow: 'hidden', textDecoration: 'none', color: 'inherit', display: 'block' }}>
                    <div style={{ aspectRatio: '4/3', background: 'var(--site-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {p.image_url ? <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 48 }}>📦</span>}
                    </div>
                    <div style={{ padding: '12px 14px 14px' }}>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{p.name}</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--site-accent)' }}>{formatCurrency(p.price, currency)}</div>
                    </div>
                  </a>
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: 32 }}>
                <a href={`/store/${params.slug}`} style={{ padding: '12px 28px', background: 'var(--site-accent)', color: '#fff', borderRadius: 'var(--site-radius)', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>View All Products →</a>
              </div>
            </div>
          </section>
        )}

        {/* About */}
        {sections.about !== false && (wc.about_text || b.description) && (
          <section style={{ padding: 'clamp(60px,8vw,100px) 20px', background: 'var(--site-surface)', borderTop: '1px solid var(--site-border)', borderBottom: '1px solid var(--site-border)' }}>
            <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 36, color: 'var(--site-text)', marginBottom: 20 }}>About Us</h2>
              <p style={{ fontSize: 16, color: 'var(--site-text-2)', lineHeight: 1.8 }}>{wc.about_text ?? b.description}</p>
            </div>
          </section>
        )}

        {/* Features */}
        {sections.features !== false && (wc.features ?? []).length > 0 && (
          <section style={{ padding: 'clamp(60px,8vw,100px) 20px' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 36, color: 'var(--site-text)', marginBottom: 40, textAlign: 'center' }}>Why Choose Us</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
                {(wc.features ?? []).map((f: any, i: number) => (
                  <div key={i} style={{ background: 'var(--site-surface)', borderRadius: 'var(--site-radius)', border: '1px solid var(--site-border)', padding: 24 }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon ?? '✨'}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--site-text)', marginBottom: 8 }}>{f.title}</div>
                    <div style={{ fontSize: 14, color: 'var(--site-text-2)', lineHeight: 1.6 }}>{f.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Reviews */}
        {sections.reviews !== false && reviews.length > 0 && (
          <section style={{ padding: 'clamp(60px,8vw,100px) 20px', background: 'var(--site-surface)', borderTop: '1px solid var(--site-border)', borderBottom: '1px solid var(--site-border)' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 36, color: 'var(--site-text)', marginBottom: 40, textAlign: 'center' }}>Customer Reviews</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                {reviews.map((r: any) => (
                  <div key={r.id} style={{ background: 'var(--site-bg)', borderRadius: 'var(--site-radius)', border: '1px solid var(--site-border)', padding: '20px 20px 16px' }}>
                    <div style={{ fontSize: 14, color: 'var(--site-text-2)', lineHeight: 1.6, marginBottom: 16 }}>"{r.review}"</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--site-text)' }}>{r.customer_name}</div>
                    <div style={{ color: '#F59E0B', fontSize: 14 }}>{'★'.repeat(r.rating ?? 5)}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        {sections.faq !== false && (wc.faq ?? []).length > 0 && (
          <section style={{ padding: 'clamp(60px,8vw,100px) 20px' }}>
            <div style={{ maxWidth: 720, margin: '0 auto' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 36, color: 'var(--site-text)', marginBottom: 40, textAlign: 'center' }}>FAQ</h2>
              {(wc.faq ?? []).map((f: any, i: number) => (
                <div key={i} style={{ borderBottom: '1px solid var(--site-border)', paddingBottom: 20, marginBottom: 20 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--site-text)', marginBottom: 8 }}>{f.question}</div>
                  <div style={{ fontSize: 14, color: 'var(--site-text-2)', lineHeight: 1.7 }}>{f.answer}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
        {sections.contact !== false && (
          <section style={{ padding: 'clamp(60px,8vw,100px) 20px', background: 'var(--site-surface)', borderTop: '1px solid var(--site-border)' }}>
            <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 36, color: 'var(--site-text)', marginBottom: 12 }}>Get in Touch</h2>
              <p style={{ fontSize: 15, color: 'var(--site-text-2)', marginBottom: 28 }}>Have questions? Chat with us on WhatsApp or visit our store.</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                {waLink && <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ padding: '14px 28px', background: '#25D366', color: '#fff', borderRadius: 'var(--site-radius)', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>💬 WhatsApp</a>}
                <a href={`/store/${params.slug}`} style={{ padding: '14px 28px', background: 'var(--site-accent)', color: '#fff', borderRadius: 'var(--site-radius)', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>Visit Store →</a>
              </div>
              {b.city && <div style={{ marginTop: 20, fontSize: 13, color: 'var(--site-text-2)' }}>📍 {b.city}{b.country ? `, ${b.country}` : ''}</div>}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer style={{ padding: '28px 20px', borderTop: '1px solid var(--site-border)', textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: 'var(--site-text-2)' }}>
            © {new Date().getFullYear()} {b.name} · Powered by <a href="https://getorda.app" style={{ color: 'var(--site-accent)' }}>Orda</a>
          </div>
        </footer>
      </body>
    </html>
  )
}
