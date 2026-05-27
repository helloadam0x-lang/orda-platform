'use client'

import { NumberTicker } from '@/components/ui/number-ticker'
import { BlurFade } from '@/components/ui/blur-fade'

const stats = [
  { value: 2, suffix: 'M+', label: 'Messages Handled' },
  { value: 54, suffix: '', label: 'Countries' },
  { value: 500, suffix: '+', label: 'Businesses' },
]

export default function Stats() {
  return (
    <section style={{
      background: '#050507',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      padding: '80px 0',
    }}>
      <div style={{
        maxWidth: '900px', margin: '0 auto', padding: '0 24px',
        display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
        gap: '0',
      }}>
        {stats.map((stat, i) => (
          <BlurFade key={i} delay={i * 0.1}>
            <div style={{
              textAlign: 'center',
              padding: '20px',
              borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 900,
                fontSize: 'clamp(42px, 6vw, 72px)',
                letterSpacing: '-0.03em',
                color: '#EFEFEF',
                lineHeight: 1,
                display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '2px',
              }}>
                <NumberTicker value={stat.value} />
                {stat.suffix}
              </div>
              <p style={{
                marginTop: '10px',
                fontSize: '11px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(239,239,239,0.3)',
              }}>
                {stat.label}
              </p>
            </div>
          </BlurFade>
        ))}
      </div>
    </section>
  )
}
