'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const plans = [
  {
    name: 'Starter',
    price: '$19',
    period: '/month',
    trial: '7 day free trial',
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
    name: 'Pro',
    price: '$49',
    period: '/month',
    trial: '7 day free trial',
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

export default function Pricing() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (!sectionRef.current) return

    gsap.fromTo(
      sectionRef.current.querySelector('.section-header'),
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
      }
    )

    cardsRef.current.forEach((card, i) => {
      if (!card) return
      gsap.fromTo(
        card,
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          delay: i * 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
        }
      )
    })
  }, [])

  return (
    <section ref={sectionRef} id="pricing" className="py-24 relative overflow-hidden">
      {/* Watermark */}
      <div className="pricing-watermark absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none">
        PRICING
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="section-header text-center mb-16" style={{ opacity: 0 }}>
          <div className="inline-block px-4 py-1.5 rounded-full glass-card border border-accent/20 text-xs font-medium text-accent-light tracking-widest uppercase mb-4">
            Pricing
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-text-primary leading-tight">
            Simple. Honest. <span className="text-gradient-purple">Pricing.</span>
          </h2>
          <p className="text-text-muted mt-4">Start free. No credit card required.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 justify-center items-stretch max-w-3xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              ref={(el) => { if (el) cardsRef.current[i] = el }}
              className={`flex-1 relative glass-card rounded-3xl p-8 flex flex-col gap-6 transition-all duration-300
                hover:-translate-y-3 hover:shadow-2xl
                ${plan.popular
                  ? 'border-accent/40 scale-[1.02] shadow-[0_0_60px_rgba(135,41,160,0.2)]'
                  : 'hover:border-white/15'
                }`}
              style={{ opacity: 0 }}
              onMouseEnter={(e) => {
                if (plan.popular) {
                  e.currentTarget.style.boxShadow = '0 0 80px rgba(135,41,160,0.35)'
                }
              }}
              onMouseLeave={(e) => {
                if (plan.popular) {
                  e.currentTarget.style.boxShadow = '0 0 60px rgba(135,41,160,0.2)'
                }
              }}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <div className="px-4 py-1 rounded-full bg-gradient-to-r from-accent to-purple-600 text-white text-xs font-bold tracking-widest uppercase shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}

              <div>
                <div className="text-sm font-medium text-text-muted tracking-widest uppercase mb-3">{plan.name}</div>
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-black text-text-primary">{plan.price}</span>
                  <span className="text-text-muted pb-2">{plan.period}</span>
                </div>
                <div className="text-xs text-accent-light mt-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-light" />
                  {plan.trial}
                </div>
              </div>

              <div className="w-full h-px bg-white/5" />

              <ul className="flex flex-col gap-3 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-text-muted">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 mt-0.5 flex-shrink-0 fill-none stroke-accent-light stroke-2" xmlns="http://www.w3.org/2000/svg">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className={`w-full py-4 rounded-2xl font-semibold text-sm text-center transition-all duration-300
                  ${plan.popular
                    ? 'btn-primary text-white'
                    : 'btn-secondary text-text-primary hover:text-white'
                  }`}
              >
                Get Started Free →
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-text-muted mt-8">
          No credit card required · Cancel anytime · Upgrade or downgrade at any time
        </p>
      </div>
    </section>
  )
}
