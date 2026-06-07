'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { BorderBeam } from '@/components/ui/border-beam'

const SPRING = { type: 'spring' as const, stiffness: 400, damping: 25 }

const plans = [
  {
    name: 'STARTER',
    price: '$19',
    period: '/mo',
    trial: '7-day free trial',
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
    name: 'PRO',
    price: '$49',
    period: '/mo',
    trial: '7-day free trial',
    badge: 'MOST POPULAR',
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
    <section id="pricing" style={{ background: '#050505', padding: '120px 0' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '0 24px' }}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={SPRING}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: '#00FF66', marginBottom: 16,
          }}>
            PRICING · NO_SURPRISES
          </div>
          <h2 style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 900,
            fontSize: 'clamp(36px, 5vw, 60px)',
            letterSpacing: '-0.03em',
            color: '#F5F5F5',
          }}>
            Simple. Honest. Pricing.
          </h2>
          <p style={{
            marginTop: 14, fontSize: 15,
            color: 'rgba(245,245,245,0.4)',
            fontFamily: 'var(--font-body)',
          }}>
            Start free for 7 days. No credit card required.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ ...SPRING, delay: i * 0.08 }}
              style={{
                position: 'relative',
                borderRadius: 20,
                padding: '32px',
                background: plan.featured
                  ? 'rgba(245,158,11,0.03)'
                  : 'rgba(255,255,255,0.01)',
                border: plan.featured
                  ? '1px solid rgba(245,158,11,0.15)'
                  : '1px solid rgba(255,255,255,0.06)',
                boxShadow: plan.featured
                  ? '0 0 40px rgba(245,158,11,0.06)'
                  : 'none',
                transform: plan.featured ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              {plan.featured && <BorderBeam size={300} duration={6} colorFrom="#F59E0B" colorTo="transparent" />}

              {plan.badge && (
                <div style={{
                  position: 'absolute', top: -12, left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#F59E0B',
                  color: '#050505',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9, fontWeight: 700,
                  letterSpacing: '0.12em',
                  padding: '4px 14px', borderRadius: 100,
                  whiteSpace: 'nowrap',
                }}>
                  {plan.badge}
                </div>
              )}

              {/* Plan name */}
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10, letterSpacing: '0.12em',
                color: 'rgba(245,245,245,0.35)',
                marginBottom: 16,
              }}>
                {plan.name}
              </div>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  fontSize: 'clamp(48px, 6vw, 72px)',
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  color: plan.featured ? '#F59E0B' : '#F5F5F5',
                }}>
                  {plan.price}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                  color: 'rgba(245,245,245,0.3)',
                }}>
                  {plan.period}
                </span>
              </div>

              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10, letterSpacing: '0.06em',
                color: 'rgba(245,158,11,0.6)',
                marginBottom: 24,
              }}>
                {plan.trial}
              </p>

              <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 24 }} />

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {plan.features.map((f, j) => (
                  <li key={j} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    fontSize: 13, color: 'rgba(245,245,245,0.6)',
                    fontFamily: 'var(--font-body)',
                  }}>
                    <svg width={13} height={13} viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M2 6.5L5 9.5L11 3.5" stroke="#00FF66" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Link href="/sign-up" style={{ display: 'block', width: '100%' }}>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: '100%',
                    padding: '13px 20px',
                    background: plan.featured ? '#F59E0B' : 'rgba(255,255,255,0.04)',
                    border: plan.featured ? 'none' : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 10,
                    color: plan.featured ? '#050505' : 'rgba(245,245,245,0.6)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 14, fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'opacity 150ms ease',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.88' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
                >
                  {plan.cta}
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ ...SPRING, delay: 0.2 }}
          style={{
            textAlign: 'center', marginTop: 28,
            fontFamily: 'var(--font-mono)',
            fontSize: 10, letterSpacing: '0.06em',
            color: 'rgba(245,245,245,0.2)',
          }}
        >
          NO_SETUP_FEE · CANCEL_ANYTIME · INSTANT_ACTIVATION
        </motion.p>
      </div>
    </section>
  )
}
