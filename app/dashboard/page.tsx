import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', user?.id ?? '')
    .single()

  const fullName = user?.user_metadata?.full_name as string | undefined
  const greeting = fullName ? `Welcome, ${fullName.split(' ')[0]}` : 'Welcome to Orda'

  const platforms = [
    { key: 'whatsapp_connected', label: 'WhatsApp', color: '#25D366' },
    { key: 'instagram_connected', label: 'Instagram', color: '#C13584' },
    { key: 'tiktok_connected', label: 'TikTok', color: '#FE2C55' },
    { key: 'facebook_connected', label: 'Facebook', color: '#1877F2' },
  ] as const

  return (
    <div style={{ maxWidth: 900 }}>
      <h1 style={{ color: '#E4F0F6', fontSize: 28, fontWeight: 700, margin: '0 0 4px', fontFamily: 'Space Grotesk, sans-serif' }}>
        {greeting} 👋
      </h1>
      <p style={{ color: '#8892A4', fontSize: 15, marginBottom: 40 }}>
        {business ? `Managing ${business.name}` : "Let's get your business set up."}
      </p>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Messages Today', value: '—' },
          { label: 'Active Conversations', value: '—' },
          { label: 'Plan', value: business?.plan ? business.plan.charAt(0).toUpperCase() + business.plan.slice(1) : '—' },
          { label: 'Trial Ends', value: business?.plan_expires_at ? new Date(business.plan_expires_at).toLocaleDateString() : '—' },
        ].map(stat => (
          <div
            key={stat.label}
            style={{ background: '#0A1200', border: '1px solid #1a2400', borderRadius: 12, padding: '20px 24px' }}
          >
            <p style={{ color: '#8892A4', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px', fontWeight: 500 }}>{stat.label}</p>
            <p style={{ color: '#E4F0F6', fontSize: 26, fontWeight: 700, margin: 0, fontFamily: 'Space Grotesk, sans-serif' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Connected Platforms */}
      <div style={{ background: '#0A1200', border: '1px solid #1a2400', borderRadius: 12, padding: '24px 28px' }}>
        <h2 style={{ color: '#E4F0F6', fontSize: 16, fontWeight: 600, margin: '0 0 20px', fontFamily: 'Space Grotesk, sans-serif' }}>
          Connected Platforms
        </h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {platforms.map(p => {
            const connected = business?.[p.key] as boolean | undefined
            return (
              <div
                key={p.key}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: connected ? `${p.color}15` : '#111111',
                  border: `1px solid ${connected ? p.color : '#1a2400'}`,
                  borderRadius: 8, padding: '8px 16px',
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: connected ? p.color : '#3a4050' }} />
                <span style={{ color: connected ? '#E4F0F6' : '#8892A4', fontSize: 13, fontWeight: 500 }}>{p.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
