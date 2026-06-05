import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#111111',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #8729A0, #6a1f80)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 900,
                fontSize: 18,
                fontFamily: 'Space Grotesk, sans-serif',
              }}
            >
              O
            </div>
            <span
              style={{
                color: '#E4F0F6',
                fontWeight: 700,
                fontSize: 22,
                fontFamily: 'Space Grotesk, sans-serif',
                letterSpacing: '-0.02em',
              }}
            >
              ORDA
            </span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  )
}
