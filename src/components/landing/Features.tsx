'use client'

import { Globe, Zap, ShoppingBag, Bell, Store, Star, CreditCard, Building2 } from 'lucide-react'
import { MagicCard } from '@/components/ui/magic-card'
import { BlurFade } from '@/components/ui/blur-fade'

const features = [
  { icon: Globe, title: 'Speaks Every Language', desc: 'Detects and replies in any language instantly. No setup required.' },
  { icon: Zap, title: 'Always On', desc: 'Never misses a message. 3am. Christmas Day. Any timezone.' },
  { icon: ShoppingBag, title: 'Takes Real Orders', desc: 'Full order flow inside WhatsApp. No app needed.' },
  { icon: Bell, title: 'Shopify Notifications', desc: 'Every order triggers instant notifications to owner and staff.' },
  { icon: Store, title: 'Your Online Store', desc: 'Beautiful public storefront. Share the link everywhere.' },
  { icon: Star, title: 'Customer Reviews', desc: 'AI collects reviews after every order automatically.' },
  { icon: CreditCard, title: 'Payments Inside Chat', desc: 'Customers pay without leaving the conversation.' },
  { icon: Building2, title: 'Any Business', desc: 'Restaurant, boutique, pharmacy, salon. Any business anywhere.' },
]

export default function Features() {
  return (
    <section id="features" style={{ background: '#050507', padding: '120px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <BlurFade delay={0.1}>
          <div style={{ marginBottom: '64px' }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(239,239,239,0.3)', marginBottom: '16px', fontFamily: 'var(--font-body)' }}>
              Features
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display, "Playfair Display", serif)',
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
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <BlurFade key={i} delay={0.1 + i * 0.05}>
                <MagicCard
                  className='rounded-2xl p-6 h-full cursor-default bg-[rgba(255,255,255,0.02)]'
                  gradientColor='rgba(212,168,83,0.06)'
                >
                  <div style={{
                    width: 48, height: 48,
                    borderRadius: 14,
                    background: 'rgba(212,168,83,0.08)',
                    border: '1px solid rgba(212,168,83,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '16px',
                    color: '#D4A853',
                  }}>
                    <Icon size={22} strokeWidth={1.5} />
                  </div>
                  <h3 style={{ color: '#EFEFEF', fontSize: '15px', fontWeight: 600, marginBottom: '8px', fontFamily: 'var(--font-body)' }}>{f.title}</h3>
                  <p style={{ color: 'rgba(239,239,239,0.4)', fontSize: '13px', lineHeight: 1.6, fontFamily: 'var(--font-body)' }}>{f.desc}</p>
                </MagicCard>
              </BlurFade>
            )
          })}
        </div>
      </div>
    </section>
  )
}
