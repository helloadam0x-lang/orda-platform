'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCardTilt } from '@/hooks/useCardTilt'

gsap.registerPlugin(ScrollTrigger)

const testimonials = [
  {
    quote: 'Before Orda I was losing customers every night. Now every message is answered in seconds. My sales doubled in 30 days.',
    name: 'Sarah M.', role: 'Boutique Owner', country: 'London',
    rotation: '-2deg', color: '#C084FC',
  },
  {
    quote: 'My customers message in 6 languages. Orda replies perfectly in all of them. I cannot believe this is real.',
    name: 'James K.', role: 'Electronics Store', country: 'Dubai',
    rotation: '1.5deg', color: '#2AABEE',
  },
  {
    quote: 'The store builder alone is worth everything. I shared my link on TikTok and got 40 orders in one day.',
    name: 'Amara D.', role: 'Fashion Store', country: 'Lagos',
    rotation: '-1deg', color: '#25D366',
  },
]

function Stars() {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-yellow-400">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  )
}

function TestCard({ t, i }: { t: typeof testimonials[0]; i: number }) {
  const { ref, onMouseMove, onMouseLeave } = useCardTilt(4)

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="glass glow-card rounded-3xl p-8 flex flex-col gap-5 hover:-translate-y-2 transition-transform duration-300"
      style={{ opacity: 0, transform: `rotate(${t.rotation})`, transformStyle: 'preserve-3d' }}
    >
      <Stars />
      <blockquote className="text-[15px] text-white/75 leading-[1.75] flex-1">
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-black text-white"
          style={{ background: `linear-gradient(135deg, ${t.color}40, ${t.color}18)`, border: `1px solid ${t.color}30` }}>
          {t.name.charAt(0)}
        </div>
        <div>
          <div className="text-[13px] font-semibold text-white">{t.name}</div>
          <div className="text-[11px] text-white/35">{t.role} · {t.country}</div>
        </div>
        <div className="ml-auto w-2 h-2 rounded-full" style={{ background: t.color, boxShadow: `0 0 8px ${t.color}` }} />
      </div>
    </div>
  )
}

export default function Testimonials() {
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
      gsap.fromTo(c, { opacity: 0, y: 55, rotationZ: parseFloat(testimonials[i]?.rotation ?? '0') * 2 }, {
        opacity: 1, y: 0, rotationZ: parseFloat(testimonials[i]?.rotation ?? '0'),
        duration: 0.85, ease: 'power3.out',
        delay: i * 0.1,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' }
      })
    })
  }, [])

  return (
    <section ref={sectionRef} className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="header text-center mb-14" style={{ opacity: 0 }}>
          <div className="label-pill mx-auto mb-5">Testimonials</div>
          <h2 className="text-[clamp(32px,4.5vw,52px)] font-black text-white leading-tight tracking-tight">
            Businesses <span className="text-gradient">Love It</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div key={t.name} ref={el => { cardsRef.current[i] = el }}>
              <TestCard t={t} i={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
