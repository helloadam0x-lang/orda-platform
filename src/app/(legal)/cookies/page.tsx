export const metadata = { title: 'Cookie Policy — Orda' }

export default function CookiesPage() {
  return (
    <div style={{ lineHeight: 1.7 }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 36, color: '#111', marginBottom: 8 }}>Cookie Policy</h1>
      <p style={{ color: '#999', marginBottom: 32 }}>Last updated: June 2026</p>

      {[
        { title: 'What are cookies?', body: 'Cookies are small text files stored on your device when you visit a website. They help us provide a working, secure experience.' },
        { title: 'Essential Cookies', body: 'These are required for the platform to function. They store your session token and authentication state. They cannot be disabled without breaking the site.' },
        { title: 'Analytics Cookies', body: 'Optional. We may use anonymous analytics (Plausible or similar) to understand how the platform is used. No personal data is collected. You can opt out in your account settings.' },
        { title: 'No Advertising Cookies', body: 'We do not use advertising or tracking cookies. We do not share your data with ad networks.' },
        { title: 'Managing Cookies', body: 'You can clear cookies in your browser settings at any time. Essential cookies will be reset on your next login.' },
      ].map(s => (
        <section key={s.title} style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 10 }}>{s.title}</h2>
          <p style={{ color: '#444', fontSize: 15 }}>{s.body}</p>
        </section>
      ))}
    </div>
  )
}
