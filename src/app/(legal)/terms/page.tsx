export const metadata = { title: 'Terms of Service — Orda' }

export default function TermsPage() {
  return (
    <div style={{ lineHeight: 1.7 }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 36, color: '#111', marginBottom: 8 }}>Terms of Service</h1>
      <p style={{ color: '#999', marginBottom: 32 }}>Last updated: June 2026 · Orda Technologies Ltd, Kampala, Uganda</p>

      {[
        { title: '1. Acceptance', body: 'By creating an Orda account, you agree to these Terms of Service. If you do not agree, do not use the platform.' },
        { title: '2. Description of Service', body: 'Orda is a SaaS platform that enables businesses to connect WhatsApp, deploy an AI agent for customer communication, run an online store, and manage orders. We offer Starter and Pro subscription plans.' },
        { title: '3. Accounts', body: 'You must provide accurate information when creating your account. You are responsible for maintaining the security of your account credentials. One business per account.' },
        { title: '4. Acceptable Use', body: 'You may not use Orda to send spam, illegal content, or to deceive customers. You must comply with WhatsApp Business Policy and all applicable local laws. Orda may suspend accounts that violate these rules.' },
        { title: '5. Subscriptions & Billing', body: 'Subscriptions are billed monthly. The 7-day free trial automatically converts to your selected plan. Payments are processed by DusuPay. Refunds are available within 48 hours of payment.' },
        { title: '6. WhatsApp Policy Compliance', body: 'You acknowledge that your use of WhatsApp through Orda must comply with Meta\'s Business Messaging Policy. Orda is not affiliated with Meta or WhatsApp.' },
        { title: '7. Data & Privacy', body: 'Your data and your customers\' data is governed by our Privacy Policy. You own your business data. We process it solely to provide the service.' },
        { title: '8. Limitation of Liability', body: 'Orda provides the platform on an "as-is" basis. We are not liable for lost revenue, service interruptions, or issues arising from WhatsApp policy changes.' },
        { title: '9. Termination', body: 'You may delete your account at any time. We may terminate accounts that violate these terms, with 7 days notice except for severe violations.' },
        { title: '10. Governing Law', body: 'These terms are governed by the laws of Uganda. Disputes shall be resolved in the courts of Kampala, Uganda.' },
      ].map(s => (
        <section key={s.title} style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 10 }}>{s.title}</h2>
          <p style={{ color: '#444', fontSize: 15 }}>{s.body}</p>
        </section>
      ))}
    </div>
  )
}
