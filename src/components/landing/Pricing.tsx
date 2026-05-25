'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMagneticCursor } from '@/hooks/useMagneticCursor'

gsap.registerPlugin(ScrollTrigger)

const plans = [
  {
    name: 'Starter',
    price: '$19',
    period: '/month',
    trial: '7 day free trial',
    popular: false,
    features: ['2,000 messages / month', 'WhatsApp + 2 platforms', 'AI auto-replies', 'Store builder', 'Order management', 'Basic analytics'],
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/month',
    trial: '7 day free trial',
    popular: true,
    features: ['Unlimited messages', 'All platforms', 'Custom AI personality', 'Payments inside chat', 'Voice messages', 'Delivery management', 'Staff routing', 'Weekly reports', 'Full analytics', 'Priority support'],
  },
]

function Check() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0 fill-none stroke-[#C084FC] stroke-2 mt-0.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export default function Pricing() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const card0Ref = useMagneticCursor<HTMLDivElement>(0)
  const card1Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    gsap.fromTo(sectionRef.current.querySelector('.header'), { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' }
    })
    const cards = sectionRef.current.querySelectorAll('.price-card')
    gsap.fromTo(cards, { opacity: 0, y: 60 }, {
      opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', stagger: 0.12,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' }
    })
  }, [])

  return (
    <section ref={sectionRef} id="pricing" className="py-24 relative overflow-hidden">
      {/* Watermark — extracted from Pills/editorial references */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(80px,18vw,240px)] font-black text-white/[0.018] tracking-tighter pointer-events-none select-none whitespace-nowrap">
        PRICING
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="header text-center mb-14" style={{ opacity: 0 }}>
          <div className="label-pill mx-auto mb-5">Pricing</div>
          <h2 className="text-[clamp(32px,4.5vw,52px)] font-black text-white leading-tight tracking-tight">
            Simple. Honest. <span className="text-gradient">Pricing.</span>
          </h2>
          <p className="text-white/40 mt-3 text-[15px]">Start free. No credit card required.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-5 justify-center items-stretch max-w-2xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              ref={i === 0 ? card0Ref : card1Ref}
              className={`price-card flex-1 glass glow-card rounded-3xl p-8 flex flex-col gap-6 transition-all duration-350
                hover:-translate-y-3 hover:shadow-2xl
                ${plan.popular ? 'border-[#8729A0]/40 scale-[1.02] shadow-[0_0_70px_rgba(135,41,160,0.22)]' : ''}`}
              style={{ opacity: 0 }}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full text-[11px] font-black tracking-widest uppercase text-white shadow-lg"
                    style={{ background: 'linear-gradient(135deg,#8729A0,#6b21a8)' }}>
                    Most Popular
                  </span>
                </div>
              )}

              <div>
                <div className="text-[11px] font-semibold text-white/35 tracking-[0.18em] uppercase mb-3">{plan.name}</div>
                <div className="flex items-end gap-1.5">
                  <span className="text-[52px] font-black text-white leading-none">{plan.price}</span>
                  <span className="text-white/35 pb-2 text-[14px]">{plan.period}</span>
                </div>
                <div className="text-[12px] text-[#C084FC] mt-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C084FC]" />
                  {plan.trial}
                </div>
              </div>

              <div className="h-px bg-white/[0.06]" />

              <ul className="space-y-2.5 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px] text-white/45">
                    <Check />
                    {f}
                  </li>
                ))}
              </ul>

              <a href="#"
                className={`block w-full py-4 rounded-2xl text-[14px] font-semibold text-center transition-all duration-250
                  ${plan.popular ? 'btn-cta text-white' : 'btn-ghost text-white/80 hover:text-white'}`}>
                Get Started Free →
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-[12px] text-white/25 mt-8">
          No credit card · Cancel anytime · Upgrade or downgrade whenever
        </p>
      </div>
    </section>
  )
}
