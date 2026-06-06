import Link from 'next/link'

export default function SupportPage() {
  return (
    <main style={{ background: '#050507', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"DM Sans", sans-serif' }}>
      <div style={{ maxWidth: '480px', width: '100%', padding: '40px 24px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 900, fontSize: '48px', color: '#EFEFEF', letterSpacing: '-0.03em', lineHeight: 1 }}>
          Need help?
        </h1>
        <p style={{ marginTop: '16px', fontSize: '16px', color: 'rgba(239,239,239,0.5)', lineHeight: 1.6 }}>
          Email us at{' '}
          <a href="mailto:hello@getorda.app" style={{ color: '#D4A853', textDecoration: 'none' }}>
            hello@getorda.app
          </a>
          {' '}and we'll get back to you within 24 hours.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-block', marginTop: '32px', padding: '12px 28px',
            background: '#D4A853', color: '#050507', borderRadius: '10px',
            fontSize: '14px', fontWeight: 700, textDecoration: 'none',
          }}
        >
          Back to home
        </Link>
      </div>
    </main>
  )
}
