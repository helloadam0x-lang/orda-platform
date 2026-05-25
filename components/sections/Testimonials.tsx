'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const testimonials = [
  {
    quote: 'Before Orda I was losing customers every night. Now every message is answered in seconds. My sales doubled in 30 days.',
    name: 'Sarah M.',
    role: 'Boutique Owner',
    country: 'London',
    rotation: '-2deg',
  },
  {
    quote: 'My customers message in 6 languages. Orda replies perfectly in all of them. I cannot believe this is real.',
    name: 'James K.',
    role: 'Electronics Store',
    country: 'Dubai',
    rotation: '1deg',
  },
  {
    quote: 'The store builder alone is worth everything. I shared my link on TikTok and got 40 orders in one day.',
    name: 'Amara D.',
    role: 'Fashion Store',
    country: 'Lagos',
    rotation: '-1deg',
  },
]

function Stars() {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="w-4 h-4 fill-yellow-400" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
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
        { opacity: 0, y: 60, rotationZ: parseFloat(testimonials[i]?.rotation ?? '0') * 2 },
        {
          opacity: 1, y: 0, rotationZ: parseFloat(testimonials[i]?.rotation ?? '0'),
          duration: 0.8, ease: 'power3.out',
          delay: i * 0.12,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
        }
      )
    })
  }, [])

  return (
    <section ref={sectionRef} className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="section-header text-center mb-16" style={{ opacity: 0 }}>
          <div className="inline-block px-4 py-1.5 rounded-full glass-card border border-accent/20 text-xs font-medium text-accent-light tracking-widest uppercase mb-4">
            Testimonials
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-text-primary leading-tight">
            Businesses <span className="text-gradient-purple">Love It</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              ref={(el) => { if (el) cardsRef.current[i] = el }}
              className="glass-card rounded-3xl p-8 flex flex-col gap-6 hover:-translate-y-2 transition-transform duration-300"
              style={{ opacity: 0, transform: `rotate(${t.rotation})` }}
            >
              <Stars />

              <blockquote className="text-text-primary leading-relaxed text-base flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/40 to-accent-light/20 flex items-center justify-center text-white font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-text-primary text-sm">{t.name}</div>
                  <div className="text-xs text-text-muted">{t.role} · {t.country}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
