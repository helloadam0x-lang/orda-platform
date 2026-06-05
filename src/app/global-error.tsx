'use client'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body style={{ background: '#050507', color: '#F0F0F0', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', margin: 0 }}>
        <div style={{ textAlign: 'center', padding: 40, maxWidth: 400 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 32, color: '#D4A853', marginBottom: 16 }}>
            Something went wrong
          </div>
          <p style={{ color: 'rgba(240,240,240,0.5)', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
            An unexpected error occurred. Our team has been notified.
          </p>
          <button
            onClick={reset}
            style={{ padding: '12px 32px', background: '#D4A853', color: '#050507', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  )
}
