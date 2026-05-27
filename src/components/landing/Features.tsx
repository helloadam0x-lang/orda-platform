'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Globe, Clock, ShoppingCart, Bell, Store, Star, CreditCard, Building2,
} from 'lucide-react'
import { BentoGrid } from '@/components/ui/bento-grid'
import type { BentoItem } from '@/components/ui/bento-grid'

gsap.registerPlugin(ScrollTrigger)

const features: BentoItem[] = [
  {
    title: 'Speaks Every Language',
    body: 'Detects and replies in any language instantly. No setup required.',
    icon: <Globe size={18} />,
    colSpan: 2,
    accent: false,
  },
  {
    title: 'Always On 24/7',
    body: 'Never misses a message. 3am. Christmas Day. Any timezone.',
    icon: <Clock size={18} />,
    colSpan: 1,
    accent: false,
  },
  {
    title: 'Takes Real Orders',
    body: 'Full order flow inside WhatsApp. No app download needed.',
    icon: <ShoppingCart size={18} />,
    colSpan: 1,
    accent: true,
  },
  {
    title: 'Payments Inside Chat',
    body: 'Customers pay inside the chat. Card, bank transfer — collected instantly.',
    icon: <CreditCard size={18} />,
    colSpan: 2,
    accent: true,
  },
  {
    title: 'Instant Notifications',
    body: 'Every order triggers instant alerts to owner and staff.',
    icon: <Bell size={18} />,
    colSpan: 1,
    accent: false,
  },
  {
    title: 'Your Online Store',
    body: 'Beautiful public storefront. Share the link everywhere.',
    icon: <Store size={18} />,
    colSpan: 1,
    accent: false,
  },
  {
    title: 'Customer Reviews',
    body: 'AI collects reviews after every order automatically.',
    icon: <Star size={18} />,
    colSpan: 1,
    accent: false,
  },
  {
    title: 'Works for Any Business',
    body: 'Restaurant, pharmacy, boutique, salon. Any business, anywhere.',
    icon: <Building2 size={18} />,
    colSpan: 1,
    accent: false,
  },
]

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    gsap.fromTo(
      sectionRef.current.querySelector('.header'),
      { opacity: 0, y: 30, scale: 0.97 },
      {
        opacity: 1, y: 0, scale: 1, duration: 0.8,
        ease: 'cubic-bezier(0.23,1,0.32,1)',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' },
      }
    )
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

        <BentoGrid items={features} />
      </div>
    </section>
  )
}
