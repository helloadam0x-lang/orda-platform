export const metadata = { title: 'Privacy Policy — Orda' }

export default function PrivacyPage() {
  return (
    <div className="prose prose-gray max-w-none" style={{ lineHeight: 1.7 }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 36, color: '#111', marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ color: '#999', marginBottom: 32 }}>Last updated: June 2026 · Orda Technologies Ltd, Kampala, Uganda</p>

      {[
        { title: '1. Data We Collect', body: 'We collect business information (name, type, location), WhatsApp phone numbers for connection, customer messages processed through our AI, order details, and payment metadata. We do not store full payment card numbers.' },
        { title: '2. How We Use Your Data', body: 'Your data is used to operate the Orda platform — powering your AI agent, processing orders, sending notifications, and generating analytics. We do not sell your data to third parties.' },
        { title: '3. Customer Data', body: 'When customers message your business, their messages are processed by our AI. Customers can opt out at any time by sending "STOP" to your WhatsApp number. We honor all opt-out requests within 24 hours.' },
        { title: '4. Data Retention', body: 'We retain your business data as long as your account is active. Upon account deletion, we delete all associated data within 30 days. Message logs are retained for 90 days.' },
        { title: '5. Security', body: 'All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We use Supabase (hosted on AWS) for data storage. Access is restricted to authenticated staff only.' },
        { title: '6. Your Rights (GDPR)', body: 'You have the right to access, correct, export, or delete your personal data at any time. Submit requests via your dashboard Settings → Data, or email privacy@getorda.app.' },
        { title: '7. Cookies', body: 'We use essential cookies for authentication and session management. Optional analytics cookies are only set with your consent. See our Cookie Policy for details.' },
        { title: '8. Third Parties', body: 'We share data with: Supabase (database), Google Gemini (AI processing), DusuPay (payments), Resend (email), Sentry (error monitoring). All are bound by data processing agreements.' },
        { title: '9. Contact', body: 'For privacy questions, contact us at privacy@getorda.app or write to: Orda Technologies Ltd, Kampala, Uganda.' },
      ].map(s => (
        <section key={s.title} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 10 }}>{s.title}</h2>
          <p style={{ color: '#444', fontSize: 15 }}>{s.body}</p>
        </section>
      ))}
    </div>
  )
}
