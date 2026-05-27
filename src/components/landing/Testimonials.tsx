'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCardTilt } from '@/hooks/useCardTilt'

gsap.registerPlugin(ScrollTrigger)

const testimonials = [
  {
    quote: 'Before Orda I was losing customers every night. Now every message is answered in seconds. My revenue doubled in 30 days.',
    name: 'Sarah M.', role: 'Boutique Owner', country: 'London',
    rotation: -2,
  },
  {
    quote: 'My customers message in six languages. Orda replies perfectly in all of them. I still cannot believe this is real.',
    name: 'James K.', role: 'Electronics Store', country: 'Dubai',
    rotation: 0,
  },
  {
    quote: 'I shared my store link and got 40 orders the same day. Orda handled every single reply automatically. This changed everything.',
    name: 'Amara D.', role: 'Fashion Store', country: 'Toronto',
    rotation: 1.5,
  },
]

function Stars() {
  return (
    <div className="flex gap-0.5">
      {([1,2,3,4,5]).map((n) => (
        <svg key={n} viewBox="0 0 24 24" className="w-3.5 h-3.5" style={{ fill: 'var(--accent)' }}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

function TestCard({ t, isCenter }: { t: typeof testimonials[0]; isCenter: boolean }) {
  const { ref, onMouseMove, onMouseLeave } = useCardTilt(4)

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="glass-surface rounded-3xl p-8 flex flex-col gap-5"
      style={{
        opacity: 0,
        transform: `rotate(${t.rotation}deg) translateY(${isCenter ? 0 : 20}px)`,
        transformStyle: 'preserve-3d',
      }}
    >
      <Stars />
      <blockquote
        className="font-body text-[15px] italic leading-[1.75] flex-1"
        style={{ color: 'var(--text-primary)' }}
      >
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-[13px]"
          style={{
            background: 'rgba(212,168,83,0.1)',
            border: '1px solid rgba(212,168,83,0.2)',
            color: 'var(--accent)',
          }}
        >
          {t.name.charAt(0)}
        </div>
        <div>
          <div className="font-display font-[600] text-[13px]" style={{ color: 'var(--text-primary)' }}>{t.name}</div>
          <div className="font-body text-[11px]" style={{ color: 'var(--text-muted)' }}>{t.role} · {t.country}</div>
        </div>
        <div
          className="ml-auto w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: 'var(--accent)', boxShadow: '0 0 8px rgba(212,168,83,0.6)' }}
        />
      </div>
    </div>
  )
}

export default function Testimonials() {
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
        { opacity: 0, y: 60, rotationZ: testimonials[i]?.rotation ?? 0, scale: 0.95 },
        {
          opacity: 1, y: 0, rotationZ: testimonials[i]?.rotation ?? 0,
          duration: 0.85, ease: 'cubic-bezier(0.23,1,0.32,1)',
          delay: i * 0.08,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' },
        }
      )
    })
  }, [])

  return (
    <section ref={sectionRef} id="testimonials" className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="header text-center mb-16" style={{ opacity: 0 }}>
          <div className="label-pill mx-auto mb-6">Testimonials</div>
          <h2
            className="font-display font-[900] leading-[0.88] tracking-[-0.04em]"
            style={{ fontSize: 'clamp(40px,5vw,64px)', color: 'var(--text-primary)' }}
          >
            Businesses{' '}
            <span style={{ color: 'var(--accent)' }}>Love It</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              ref={el => { cardsRef.current[i] = el }}
              style={{ opacity: i === 1 ? 1 : 0.7 }}
            >
              <TestCard t={t} isCenter={i === 1} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
