import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', background: '#050505',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 16, padding: 24, textAlign: 'center',
    }}>
      <div style={{
        fontFamily: '"Playfair Display", Georgia, serif',
        fontSize: 96, fontWeight: 900, color: '#F59E0B',
        lineHeight: 1, opacity: 0.6,
      }}>404</div>
      <h1 style={{
        fontFamily: '"Playfair Display", Georgia, serif',
        fontSize: 32, fontWeight: 900, color: '#F5F5F5',
      }}>Page not found</h1>
      <p style={{ color: 'rgba(245,245,245,0.5)', fontSize: 16 }}>
        This page doesn&apos;t exist or was moved.
      </p>
      <Link
        href="/"
        style={{
          padding: '12px 28px', background: '#F59E0B',
          color: '#050505', borderRadius: 10,
          fontWeight: 600, fontSize: 15, textDecoration: 'none',
        }}
      >
        Back to Home
      </Link>
    </div>
  )
}
