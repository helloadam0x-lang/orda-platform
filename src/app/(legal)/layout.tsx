export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#FAFAF8', minHeight: '100vh', color: '#1a1a1a' }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <header style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px', height: 56, display: 'flex', alignItems: 'center' }}>
          <a href="/" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 20, color: '#111', textDecoration: 'none' }}>
            ORDA<span style={{ color: '#D4A853' }}>.</span>
          </a>
        </div>
      </header>
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '48px 20px 80px' }}>
        {children}
      </main>
      <footer style={{ textAlign: 'center', padding: '24px 20px', borderTop: '1px solid rgba(0,0,0,0.07)', fontSize: 12, color: '#bbb' }}>
        © {new Date().getFullYear()} Orda Technologies Ltd · Kampala, Uganda
      </footer>
    </div>
  )
}
