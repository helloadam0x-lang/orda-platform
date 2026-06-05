export const metadata = { title: 'GDPR & Data Rights — Orda' }

export default function GDPRPage() {
  return (
    <div style={{ lineHeight: 1.7 }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 36, color: '#111', marginBottom: 8 }}>GDPR & Data Rights</h1>
      <p style={{ color: '#999', marginBottom: 32 }}>Your rights under GDPR and similar regulations</p>

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.07)', padding: 24, marginBottom: 32 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 16 }}>Exercise Your Rights</div>
        <p style={{ fontSize: 14, color: '#555', marginBottom: 20 }}>If you are a business owner on Orda, log in to your dashboard and go to Settings → Data to:</p>
        <ul style={{ paddingLeft: 20, color: '#444', fontSize: 15, lineHeight: 2 }}>
          <li><strong>Download</strong> all your data as a JSON file</li>
          <li><strong>Delete</strong> your account and all associated data</li>
        </ul>
      </div>

      {[
        { title: 'Right of Access', body: 'You can request a full export of your personal data and your business\'s data at any time through your dashboard.' },
        { title: 'Right to Rectification', body: 'You can update your personal information at any time in your dashboard Settings.' },
        { title: 'Right to Erasure', body: 'You may request deletion of your account. All data is deleted within 30 days. Some data may be retained for legal compliance for up to 7 years (financial records).' },
        { title: 'Right to Data Portability', body: 'Your data export includes contacts, orders, messages, and business settings in machine-readable JSON format.' },
        { title: 'Right to Object', body: 'You can disable optional features (push notifications, AI-generated content) at any time in Settings.' },
        { title: 'Customer Rights (your customers)', body: 'Your customers can opt out of WhatsApp messages by texting "STOP" to your number. Orda automatically processes these requests. Customers of your business can submit data requests to your business directly, or contact privacy@getorda.app.' },
        { title: 'Data Protection Officer', body: 'Contact our DPO at privacy@getorda.app for any GDPR-related requests or complaints.' },
        { title: 'Supervisory Authority', body: 'If you believe we have violated GDPR, you may lodge a complaint with your local supervisory authority.' },
      ].map(s => (
        <section key={s.title} style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 10 }}>{s.title}</h2>
          <p style={{ color: '#444', fontSize: 15 }}>{s.body}</p>
        </section>
      ))}
    </div>
  )
}
