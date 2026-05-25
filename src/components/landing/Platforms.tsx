'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCardTilt } from '@/hooks/useCardTilt'

gsap.registerPlugin(ScrollTrigger)

const platforms = [
  {
    name: 'WhatsApp', desc: 'Primary commerce channel', color: '#25D366', glow: 'rgba(37,211,102,0.25)',
    icon: <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>,
  },
  {
    name: 'Instagram', desc: 'DMs & story commerce', color: '#E1306C', glow: 'rgba(225,48,108,0.25)',
    icon: <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
  },
  {
    name: 'TikTok', desc: 'Viral product discovery', color: '#69C9D0', glow: 'rgba(105,201,208,0.25)',
    icon: <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.54V6.78a4.85 4.85 0 01-1.02-.09z"/></svg>,
  },
  {
    name: 'Facebook', desc: 'Messenger & marketplace', color: '#1877F2', glow: 'rgba(24,119,242,0.25)',
    icon: <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
  },
  {
    name: 'Telegram', desc: 'Groups & broadcast', color: '#2AABEE', glow: 'rgba(42,171,238,0.25)',
    icon: <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>,
  },
  {
    name: 'SMS', desc: 'Universal fallback', color: '#EFEFEF', glow: 'rgba(239,239,239,0.15)',
    icon: <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 10H6v-2h12v2zm0-3H6V7h12v2z"/></svg>,
  },
]

const OFFSETS = [0, 40, -16, 56, -8, 24]

function PlatformCard({ p, offset }: { p: typeof platforms[0]; offset: number }) {
  const { ref, onMouseMove, onMouseLeave } = useCardTilt(6)
  const cardRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={(el) => {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
        (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = el
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={(e) => {
        onMouseLeave()
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'var(--border-default)'
        el.style.boxShadow = ''
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = p.color + '55'
        el.style.boxShadow = `0 0 60px ${p.glow}, 0 24px 80px rgba(0,0,0,0.5)`
      }}
      className="glass-surface rounded-2xl p-6 flex flex-col items-center gap-4 text-center"
      style={{
        opacity: 0,
        marginTop: offset,
        color: p.color,
        transformStyle: 'preserve-3d',
        transition: 'border-color 300ms cubic-bezier(0.23,1,0.32,1), box-shadow 300ms cubic-bezier(0.23,1,0.32,1), transform 300ms cubic-bezier(0.23,1,0.32,1)',
      }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ background: p.color + '14' }}
      >
        {p.icon}
      </div>
      <div>
        <div className="font-display text-[15px] font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          {p.name}
        </div>
        <div className="font-body text-[12px]" style={{ color: 'var(--text-muted)' }}>
          {p.desc}
        </div>
      </div>
    </div>
  )
}

export default function Platforms() {
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
      const fromLeft = i < 3
      gsap.fromTo(c,
        { opacity: 0, x: fromLeft ? -40 : 40, rotation: fromLeft ? 4 : -4, scale: 0.95 },
        {
          opacity: 1, x: 0, rotation: 0, scale: 1,
          duration: 0.7, ease: 'cubic-bezier(0.23,1,0.32,1)',
          delay: (i % 3) * 0.06,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' },
        }
      )
    })
  }, [])

  return (
    <section ref={sectionRef} id="platforms" className="py-32 relative overflow-hidden">
      <span className="watermark" style={{ fontSize: 'clamp(80px,15vw,180px)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
        PLATFORMS
      </span>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="header text-center mb-20" style={{ opacity: 0 }}>
          <div className="label-pill mx-auto mb-6">Integrations</div>
          <h2 className="font-display font-[900] leading-[0.88] tracking-[-0.04em] mb-4" style={{ fontSize: 'clamp(40px,5vw,64px)', color: 'var(--text-primary)' }}>
            One Inbox.<br />
            <span style={{ color: 'var(--accent)' }}>Every Platform.</span>
          </h2>
          <p className="font-body text-[15px] leading-relaxed max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
            All your messaging channels under one intelligent AI agent.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-start">
          {platforms.map((p, i) => (
            <div key={p.name} ref={el => { cardsRef.current[i] = el }}>
              <PlatformCard p={p} offset={OFFSETS[i]} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
