'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCardTilt } from '@/hooks/useCardTilt'

gsap.registerPlugin(ScrollTrigger)

const features = [
  { icon: '🌍', title: 'Speaks Every Language', body: 'Detects and replies in any language instantly. No setup required.', span: 2 },
  { icon: '⚡', title: 'Always On', body: 'Never misses a message. 3am. Christmas Day. Any timezone.', span: 1 },
  { icon: '🛒', title: 'Takes Real Orders', body: 'Full order flow inside WhatsApp. No app download needed.', span: 1 },
  { icon: '🔔', title: 'Shopify-Style Notifications', body: 'Every order triggers instant alerts to owner and staff.', span: 1 },
  { icon: '🏪', title: 'Your Online Store', body: 'Beautiful public storefront. Share the link everywhere.', span: 2 },
  { icon: '⭐', title: 'Customer Reviews', body: 'AI collects reviews after every order automatically.', span: 1 },
  { icon: '💳', title: 'Real Payments', body: 'Customers pay inside the chat. Mobile money, card, bank transfer.', span: 2 },
  { icon: '🌐', title: 'Works for Any Business', body: 'Restaurant, pharmacy, boutique, salon, hardware store. Any business anywhere.', span: 1 },
]

function FeatureCard({ f }: { f: typeof features[0] }) {
  const { ref, onMouseMove, onMouseLeave } = useCardTilt(5)

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="glass glow-card rounded-2xl p-7 flex flex-col gap-4 group relative overflow-hidden transition-all duration-300 hover:-translate-y-2"
      style={{ opacity: 0, transformStyle: 'preserve-3d' }}
    >
      <div className="w-8 h-0.5 rounded-full bg-gradient-to-r from-[#8729A0] to-[#C084FC]" />
      <span className="text-3xl">{f.icon}</span>
      <div>
        <h3 className="text-[16px] font-bold text-white mb-2 group-hover:text-[#C084FC] transition-colors duration-200">{f.title}</h3>
        <p className="text-[13px] text-white/40 leading-relaxed">{f.body}</p>
      </div>
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 30% 30%, rgba(135,41,160,0.08) 0%, transparent 70%)' }} />
    </div>
  )
}

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!sectionRef.current) return
    gsap.fromTo(sectionRef.current.querySelector('.header'), { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' }
    })
    cardsRef.current.forEach((c, i) => {
      if (!c) return
      gsap.fromTo(c, { opacity: 0, y: 55, rotation: i % 2 === 0 ? 2 : -2 }, {
        opacity: 1, y: 0, rotation: 0, duration: 0.75, ease: 'power3.out',
        delay: i * 0.07,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 74%' }
      })
    })
  }, [])

  return (
    <section ref={sectionRef} id="features" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="header text-center mb-14" style={{ opacity: 0 }}>
          <div className="label-pill mx-auto mb-5">Features</div>
          <h2 className="text-[clamp(32px,4.5vw,52px)] font-black text-white leading-tight tracking-tight">
            Built for Every Business <span className="text-gradient">on Earth.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              ref={el => { cardsRef.current[i] = el }}
              className={f.span === 2 ? 'lg:col-span-2' : 'lg:col-span-1'}
            >
              <FeatureCard f={f} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
