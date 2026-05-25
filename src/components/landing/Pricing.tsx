'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMagneticCursor } from '@/hooks/useMagneticCursor'
import { Check } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const plans = [
  {
    name: 'STARTER',
    price: '$19',
    period: '/month',
    trial: '7 day free trial included',
    popular: false,
    features: [
      '2,000 messages / month',
      'WhatsApp + 2 platforms',
      'AI auto-replies',
      'Store builder',
      'Order management',
      'Basic analytics',
    ],
  },
  {
    name: 'PRO',
    price: '$49',
    period: '/month',
    trial: '7 day free trial included',
    popular: true,
    features: [
      'Unlimited messages',
      'All platforms',
      'Custom AI personality',
      'Payments inside chat',
      'Voice messages',
      'Delivery management',
      'Staff routing',
      'Weekly reports',
      'Full analytics',
      'Priority support',
    ],
  },
]

function PlanCard({ plan, isRight }: { plan: typeof plans[0]; isRight: boolean }) {
  const ref = useMagneticCursor<HTMLDivElement>(0)

  return (
    <div
      ref={ref}
      className="price-card glass-surface rounded-3xl p-8 flex flex-col gap-6 relative"
      style={{
        opacity: 0,
        flex: 1,
        ...(plan.popular ? {
          border: '1px solid rgba(212,168,83,0.3)',
          boxShadow: '0 0 80px rgba(212,168,83,0.08), inset 0 1px 0 rgba(212,168,83,0.15), 0 60px 120px rgba(0,0,0,0.6)',
          transform: 'scale(1.03)',
        } : {}),
      }}
    >
      {plan.popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span
            className="font-body px-4 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest"
            style={{ border: '1px solid rgba(212,168,83,0.4)', color: 'var(--accent)', background: 'rgba(212,168,83,0.08)' }}
          >
            Most Popular
          </span>
        </div>
      )}

      <div>
        <div
          className="font-body text-[11px] font-medium uppercase tracking-[0.18em] mb-4"
          style={{ color: 'var(--text-muted)' }}
        >
          {plan.name}
        </div>
        <div className="flex items-end gap-1.5 mb-2">
          <span
            className="font-display font-[900] leading-none tracking-[-0.04em]"
            style={{ fontSize: 56, color: 'var(--text-primary)' }}
          >
            {plan.price}
          </span>
          <span className="font-body text-[14px] pb-2" style={{ color: 'var(--text-muted)' }}>
            {plan.period}
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-body text-[12px]" style={{ color: 'var(--accent)' }}>
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--accent)' }} />
          {plan.trial}
        </div>
      </div>

      <div className="h-px" style={{ background: 'var(--border-subtle)' }} />

      <ul className="space-y-2.5 flex-1">
        {plan.features.map(f => (
          <li key={f} className="flex items-start gap-2.5 font-body text-[13px]" style={{ color: 'var(--text-secondary)' }}>
            <Check size={14} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
            {f}
          </li>
        ))}
      </ul>

      <a
        href="#"
        className={plan.popular ? 'btn-primary w-full py-4 text-[14px] justify-center' : 'btn-secondary w-full py-4 text-[14px] justify-center'}
        style={{ borderRadius: '12px' }}
      >
        Get Started Free →
      </a>
    </div>
  )
}

export default function Pricing() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    gsap.fromTo(sectionRef.current.querySelector('.header'),
      { opacity: 0, y: 30, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'cubic-bezier(0.23,1,0.32,1)',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' } }
    )
    sectionRef.current.querySelectorAll('.price-card').forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: i === 1 ? 1.03 : 1,
          duration: 0.75, ease: 'cubic-bezier(0.23,1,0.32,1)',
          delay: i * 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' },
        }
      )
    })
  }, [])

  return (
    <section ref={sectionRef} id="pricing" className="py-32 relative overflow-hidden">
      <span className="watermark" style={{ fontSize: 'clamp(80px,16vw,200px)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
        PRICING
      </span>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="header text-center mb-16" style={{ opacity: 0 }}>
          <div className="label-pill mx-auto mb-6">Pricing</div>
          <h2
            className="font-display font-[900] leading-[0.88] tracking-[-0.04em]"
            style={{ fontSize: 'clamp(40px,5vw,64px)', color: 'var(--text-primary)' }}
          >
            Simple. Honest.{' '}
            <span style={{ color: 'var(--accent)' }}>Pricing.</span>
          </h2>
          <p className="font-body text-[15px] mt-4" style={{ color: 'var(--text-muted)' }}>
            Start free. No credit card required.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-5 justify-center items-stretch max-w-[860px] mx-auto">
          {plans.map((plan, i) => (
            <PlanCard key={plan.name} plan={plan} isRight={i === 1} />
          ))}
        </div>

        <p className="font-body text-center text-[12px] mt-8" style={{ color: 'var(--text-muted)' }}>
          No setup fee · Cancel anytime · Instant activation
        </p>
      </div>
    </section>
  )
}
