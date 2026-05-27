'use client'

import { MagicCard } from '@/components/ui/magic-card'
import { BlurFade } from '@/components/ui/blur-fade'

const features = [
  { icon: '🌍', title: 'Speaks Every Language', desc: 'Detects and replies in any language instantly. No setup required.' },
  { icon: '⚡', title: 'Always On', desc: 'Never misses a message. 3am. Christmas Day. Any timezone.' },
  { icon: '📦', title: 'Takes Real Orders', desc: 'Full order flow inside WhatsApp. No app needed.' },
  { icon: '🔔', title: 'Shopify Notifications', desc: 'Every order triggers instant notifications to owner and staff.' },
  { icon: '🏪', title: 'Your Online Store', desc: 'Beautiful public storefront. Share the link everywhere.' },
  { icon: '⭐', title: 'Customer Reviews', desc: 'AI collects reviews after every order automatically.' },
  { icon: '💳', title: 'Payments Inside Chat', desc: 'Customers pay without leaving the conversation.' },
  { icon: '🌐', title: 'Any Business', desc: 'Restaurant, boutique, pharmacy, salon. Any business anywhere.' },
]

export default function Features() {
  return (
    <section style={{ background: '#050507', padding: '120px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <BlurFade delay={0.1}>
          <div style={{ marginBottom: '64px' }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(239,239,239,0.3)', marginBottom: '16px' }}>
              Features
            </p>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              fontSize: 'clamp(36px, 5vw, 64px)',
              letterSpacing: '-0.03em',
              lineHeight: 0.92,
              color: '#EFEFEF',
            }}>
              Built for Every<br/>
              <span style={{ background: 'linear-gradient(135deg,#D4A853,#F5D78E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Business on Earth.
              </span>
            </h2>
          </div>
        </BlurFade>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '16px',
        }}>
          {features.map((f, i) => (
            <BlurFade key={i} delay={0.1 + i * 0.05}>
              <MagicCard
                className='rounded-2xl p-6 h-full cursor-default bg-[rgba(255,255,255,0.02)]'
                gradientColor='rgba(212,168,83,0.06)'
              >
                <div style={{ fontSize: '28px', marginBottom: '16px' }}>{f.icon}</div>
                <h3 style={{ color: '#EFEFEF', fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ color: 'rgba(239,239,239,0.4)', fontSize: '13px', lineHeight: 1.6 }}>{f.desc}</p>
              </MagicCard>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
