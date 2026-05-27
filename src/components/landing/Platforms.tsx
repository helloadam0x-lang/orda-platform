'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AuroraStaticBackground } from '@/components/ui/aurora-background'

gsap.registerPlugin(ScrollTrigger)

const WHATSAPP_PATH =
  'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z'

const PILLS = [
  'AI replies in 0.9s',
  'Voice messages understood',
  'Payments inside chat',
]

export default function Platforms() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const headRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const pillsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ease = 'cubic-bezier(0.23,1,0.32,1)'
    const trigger = { trigger: sectionRef.current, start: 'top 78%' }

    gsap.fromTo(labelRef.current, { opacity: 0, y: 16, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease, scrollTrigger: trigger })
    gsap.fromTo(logoRef.current, { opacity: 0, scale: 0.85, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease, delay: 0.08, scrollTrigger: trigger })
    gsap.fromTo(headRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.85, ease, delay: 0.16, scrollTrigger: trigger })
    gsap.fromTo(subRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease, delay: 0.24, scrollTrigger: trigger })

    if (pillsRef.current) {
      gsap.fromTo(
        Array.from(pillsRef.current.children),
        { opacity: 0, y: 16, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, ease, stagger: 0.06, delay: 0.34, scrollTrigger: trigger }
      )
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="platforms"
      className="py-32 relative overflow-hidden"
      style={{ background: '#050507' }}
    >
      <AuroraStaticBackground />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Label + logo row */}
        <div ref={labelRef} className="flex items-center gap-4 mb-8" style={{ opacity: 0 }}>
          <div
            ref={logoRef}
            className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(37,211,102,0.08)',
              border: '1px solid rgba(37,211,102,0.2)',
              boxShadow: '0 0 40px rgba(37,211,102,0.1)',
            }}
          >
            <svg viewBox="0 0 24 24" className="w-9 h-9" style={{ fill: '#25D366' }}>
              <path d={WHATSAPP_PATH} />
            </svg>
          </div>
          <span
            className="font-body font-medium uppercase tracking-[0.12em]"
            style={{ fontSize: '13px', color: 'rgba(239,239,239,0.35)' }}
          >
            The world runs on WhatsApp
          </span>
        </div>

        {/* Headline */}
        <h2
          ref={headRef}
          className="font-display font-[900] leading-[0.9] tracking-[-0.03em] mb-8"
          style={{
            fontSize: 'clamp(48px,7vw,96px)',
            color: '#EFEFEF',
            opacity: 0,
          }}
        >
          2 billion people.<br />
          <span style={{ color: '#D4A853' }}>One platform.</span><br />
          Your business.
        </h2>

        {/* Subtext */}
        <p
          ref={subRef}
          className="font-body"
          style={{
            fontSize: '18px',
            lineHeight: 1.65,
            color: 'rgba(239,239,239,0.5)',
            maxWidth: '520px',
            opacity: 0,
          }}
        >
          Orda connects directly to your WhatsApp Business number.
          Every customer message answered. Every order captured.
          Every payment collected. Inside the chat they already use every day.
        </p>

        {/* Feature pills */}
        <div
          ref={pillsRef}
          style={{ display: 'flex', gap: '12px', marginTop: '40px', flexWrap: 'wrap' }}
        >
          {PILLS.map(f => (
            <span
              key={f}
              className="font-body font-medium"
              style={{
                padding: '8px 18px',
                border: '1px solid rgba(212,168,83,0.3)',
                borderRadius: '100px',
                fontSize: '13px',
                color: '#D4A853',
                background: 'rgba(212,168,83,0.06)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                transition: 'border-color 200ms cubic-bezier(0.23,1,0.32,1), background 200ms cubic-bezier(0.23,1,0.32,1)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'rgba(212,168,83,0.6)'
                el.style.background = 'rgba(212,168,83,0.1)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'rgba(212,168,83,0.3)'
                el.style.background = 'rgba(212,168,83,0.06)'
              }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
