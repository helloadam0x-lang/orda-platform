'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    title: 'Speaks Every Language',
    desc: 'Detects and replies in any language instantly. No setup.',
    icon: '🌍',
    size: 'large',
  },
  {
    title: 'Always On',
    desc: 'Never misses a message. 3am. Christmas Day. Any timezone.',
    icon: '⚡',
    size: 'small',
  },
  {
    title: 'Takes Real Orders',
    desc: 'Full order flow inside WhatsApp. No app needed.',
    icon: '🛒',
    size: 'medium',
  },
  {
    title: 'Shopify-Style Notifications',
    desc: 'Every order triggers instant notifications to owner and staff.',
    icon: '🔔',
    size: 'small',
  },
  {
    title: 'Your Online Store',
    desc: 'Beautiful public storefront. Share the link everywhere.',
    icon: '🏪',
    size: 'large',
  },
  {
    title: 'Customer Reviews',
    desc: 'AI collects reviews after every order automatically.',
    icon: '⭐',
    size: 'medium',
  },
  {
    title: 'Real Payments',
    desc: 'Customers pay inside the chat. Mobile money, card, bank transfer.',
    icon: '💳',
    size: 'large',
  },
  {
    title: 'Works for Any Business',
    desc: 'Restaurant, pharmacy, boutique, hardware store, salon. Any business anywhere.',
    icon: '🌐',
    size: 'medium',
  },
]

export default function Features() {
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
        { opacity: 0, y: 60, rotation: i % 2 === 0 ? 2 : -2 },
        {
          opacity: 1, y: 0, rotation: 0, duration: 0.7, ease: 'power3.out',
          delay: i * 0.08,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
        }
      )
    })
  }, [])

  return (
    <section ref={sectionRef} id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="section-header text-center mb-16" style={{ opacity: 0 }}>
          <div className="inline-block px-4 py-1.5 rounded-full glass-card border border-accent/20 text-xs font-medium text-accent-light tracking-widest uppercase mb-4">
            Features
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-text-primary leading-tight">
            Built for Every Business <span className="text-gradient-purple">on Earth.</span>
          </h2>
          <p className="text-text-muted mt-4 max-w-xl mx-auto">
            Everything your business needs — inside one AI agent connected to your WhatsApp.
          </p>
        </div>

        {/* Asymmetric grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              ref={(el) => { if (el) cardsRef.current[i] = el }}
              className={`glass-card rounded-2xl p-7 flex flex-col gap-4 group hover:-translate-y-2 transition-all duration-300 cursor-default relative overflow-hidden
                ${i === 0 || i === 4 || i === 6 ? 'lg:col-span-2' : 'lg:col-span-1'}`}
              style={{ opacity: 0 }}
            >
              {/* Accent line top */}
              <div className="w-8 h-0.5 bg-gradient-to-r from-accent to-accent-light rounded-full" />

              <div className="text-3xl">{feature.icon}</div>

              <div>
                <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-accent-light transition-colors duration-200">
                  {feature.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">{feature.desc}</p>
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
