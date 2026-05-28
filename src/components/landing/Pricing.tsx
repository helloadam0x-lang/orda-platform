'use client'

import { CheckCircle } from 'lucide-react'
import { BorderBeam } from '@/components/ui/border-beam'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { BlurFade } from '@/components/ui/blur-fade'

const plans = [
  {
    name: 'Starter',
    price: '$19',
    period: '/month',
    trial: '7 day free trial',
    features: [
      '2,000 messages/month',
      'WhatsApp AI agent',
      'Store builder',
      'Order management',
      'Basic analytics',
      'Email support',
    ],
    cta: 'Start Free Trial',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/month',
    trial: '7 day free trial',
    badge: 'Most Popular',
    features: [
      'Unlimited messages',
      'WhatsApp AI agent',
      'Custom AI personality',
      'Payments inside chat',
      'Voice messages',
      'Delivery management',
      'Unlimited staff',
      'Weekly reports',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    featured: true,
  },
]

export default function Pricing() {
  return (
    <section style={{ background: '#050507', padding: '120px 0' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
        <BlurFade delay={0.1}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{
              fontFamily: 'var(--font-display, "Playfair Display", serif)',
              fontWeight: 900,
              fontSize: 'clamp(36px, 5vw, 64px)',
              letterSpacing: '-0.03em',
              color: '#EFEFEF',
            }}>
              Simple. Honest. Pricing.
            </h2>
            <p style={{ marginTop: '16px', color: 'rgba(239,239,239,0.4)', fontSize: '16px' }}>
              Start free for 7 days. No credit card required.
            </p>
          </div>
        </BlurFade>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {plans.map((plan, i) => (
            <BlurFade key={i} delay={0.15 + i * 0.1}>
              <div style={{
                position: 'relative',
                borderRadius: '20px',
                padding: '32px',
                background: plan.featured ? 'rgba(212,168,83,0.06)' : 'rgba(255,255,255,0.02)',
                border: plan.featured ? '1px solid rgba(212,168,83,0.3)' : '1px solid rgba(255,255,255,0.07)',
                transform: plan.featured ? 'scale(1.03)' : 'scale(1)',
                boxShadow: plan.featured ? '0 0 60px rgba(212,168,83,0.08)' : 'none',
              }}>
                {plan.featured && <BorderBeam size={300} duration={6} colorFrom='#D4A853' colorTo='transparent' />}
                {plan.badge && (
                  <span style={{
                    position: 'absolute', top: '-12px', left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#D4A853',
                    color: '#050507',
                    fontSize: '11px', fontWeight: 700,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    padding: '4px 14px', borderRadius: '100px',
                    whiteSpace: 'nowrap',
                  }}>{plan.badge}</span>
                )}

                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(239,239,239,0.35)' }}>
                    {plan.name}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                  <span style={{
                    fontFamily: 'var(--font-display, "Playfair Display", serif)',
                    fontWeight: 900, fontSize: '52px',
                    color: plan.featured ? '#D4A853' : '#EFEFEF',
                    letterSpacing: '-0.03em', lineHeight: 1,
                  }}>{plan.price}</span>
                  <span style={{ color: 'rgba(239,239,239,0.35)', fontSize: '14px' }}>{plan.period}</span>
                </div>

                <p style={{ fontSize: '11px', color: 'rgba(212,168,83,0.6)', marginBottom: '24px' }}>
                  {plan.trial}
                </p>

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '24px' }}/>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'rgba(239,239,239,0.6)' }}>
                      <CheckCircle size={14} style={{ color: '#D4A853', flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <ShimmerButton
                  shimmerColor={plan.featured ? '#D4A853' : 'rgba(255,255,255,0.3)'}
                  background={plan.featured ? 'rgba(212,168,83,0.15)' : 'rgba(255,255,255,0.05)'}
                  borderRadius='10px'
                  className={`w-full py-3 text-sm font-semibold ${plan.featured ? 'text-[#D4A853] border border-[rgba(212,168,83,0.4)]' : 'text-white/60 border border-white/10'}`}
                >
                  {plan.cta}
                </ShimmerButton>
              </div>
            </BlurFade>
          ))}
        </div>

        <BlurFade delay={0.4}>
          <p style={{ textAlign: 'center', marginTop: '28px', fontSize: '12px', color: 'rgba(239,239,239,0.2)' }}>
            No setup fee · Cancel anytime · Instant activation
          </p>
        </BlurFade>
      </div>
    </section>
  )
}
