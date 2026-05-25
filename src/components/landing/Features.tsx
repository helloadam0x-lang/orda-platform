'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCardTilt } from '@/hooks/useCardTilt'
import {
  Globe, Clock, ShoppingCart, Bell, Store, Star, CreditCard, Building2,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const features = [
  { Icon: Globe, title: 'Speaks Every Language', body: 'Detects and replies in any language instantly. No setup required.', wide: true, tall: false },
  { Icon: Clock, title: 'Always On 24/7', body: 'Never misses a message. 3am. Christmas Day. Any timezone.', wide: false, tall: false },
  { Icon: ShoppingCart, title: 'Takes Real Orders', body: 'Full order flow inside WhatsApp. No app download needed.', wide: false, tall: false },
  { Icon: Bell, title: 'Shopify-Style Notifications', body: 'Every order triggers instant alerts to owner and staff.', wide: false, tall: false },
  { Icon: Store, title: 'Your Online Store', body: 'Beautiful public storefront. Share the link everywhere.', wide: true, tall: false },
  { Icon: Star, title: 'Customer Reviews', body: 'AI collects reviews after every order automatically.', wide: false, tall: false },
  { Icon: CreditCard, title: 'Payments Inside Chat', body: 'Customers pay inside the chat. Mobile money, card, bank transfer.', wide: true, tall: false },
  { Icon: Building2, title: 'Works for Any Business', body: 'Restaurant, pharmacy, boutique, salon. Any business anywhere.', wide: true, tall: false },
]

function FeatureCard({ f, index }: { f: typeof features[0]; index: number }) {
  const { ref, onMouseMove, onMouseLeave } = useCardTilt(5)

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="glass-surface rounded-2xl p-7 flex flex-col gap-5 relative overflow-hidden group"
      style={{ opacity: 0, transformStyle: 'preserve-3d' }}
    >
      {/* Accent bar */}
      <div className="w-6 h-0.5 rounded-full" style={{ background: 'var(--accent)' }} />

      <f.Icon
        size={22}
        style={{ color: 'var(--text-secondary)', transition: 'color 200ms cubic-bezier(0.23,1,0.32,1)' }}
        className="group-hover:text-accent"
      />

      <div>
        <h3
          className="font-display font-bold text-[15px] mb-2"
          style={{ color: 'var(--text-primary)', transition: 'color 200ms cubic-bezier(0.23,1,0.32,1)' }}
        >
          {f.title}
        </h3>
        <p className="font-body text-[13px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {f.body}
        </p>
      </div>

      {/* Hover radial */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 30% 30%, rgba(212,168,83,0.06) 0%, transparent 70%)',
          transition: 'opacity 300ms cubic-bezier(0.23,1,0.32,1)',
        }}
      />
    </div>
  )
}

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!sectionRef.current) return
    gsap.fromTo(sectionRef.current.querySelector('.header'),
      { opacity: 0, y: 30, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'cubic-bezier(0.23,1,0.32,1)',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' } }
    )
    cardsRef.current.forEach((c, i) => {
      if (!c) return
      gsap.fromTo(c,
        { opacity: 0, y: 50, rotation: i % 2 === 0 ? 2 : -2, scale: 0.95 },
        {
          opacity: 1, y: 0, rotation: 0, scale: 1,
          duration: 0.7, ease: 'cubic-bezier(0.23,1,0.32,1)',
          delay: i * 0.06,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 74%' },
        }
      )
    })
  }, [])

  return (
    <section ref={sectionRef} id="features" className="py-32 relative overflow-hidden">
      <span className="watermark" style={{ fontSize: 'clamp(80px,14vw,160px)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
        FEATURES
      </span>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="header text-center mb-16" style={{ opacity: 0 }}>
          <div className="label-pill mx-auto mb-6">Features</div>
          <h2
            className="font-display font-[900] leading-[0.88] tracking-[-0.04em]"
            style={{ fontSize: 'clamp(40px,5vw,64px)', color: 'var(--text-primary)' }}
          >
            Built for Every Business{' '}
            <span style={{ color: 'var(--accent)' }}>on Earth.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              ref={el => { cardsRef.current[i] = el }}
              className={f.wide ? 'lg:col-span-2' : 'lg:col-span-1'}
            >
              <FeatureCard f={f} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
