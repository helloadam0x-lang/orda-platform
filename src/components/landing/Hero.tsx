'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import dynamic from 'next/dynamic'
import { useMagneticCursor } from '@/hooks/useMagneticCursor'

const OrdaBrain = dynamic(() => import('@/components/three/OrdaBrain'), { ssr: false })

const CHAT = [
  { from: 'c', text: 'Do you have this in size M?' },
  { from: 'ai', text: 'Yes — available in Black and White. Which do you prefer?' },
  { from: 'c', text: 'Black. How much?' },
  { from: 'ai', text: '$45 with free delivery. Want me to send a payment link?' },
  { from: 'c', text: 'Yes please' },
  { from: 'ai', text: 'Done. Payment link sent ✓' },
]

function ChatCard() {
  const [visible, setVisible] = useState(0)
  const [typing, setTyping] = useState(false)
  const tiltRef = useRef<HTMLDivElement>(null)

  const run = useCallback(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    const delays = [0, 1400, 2800, 3900, 5200, 6400]
    CHAT.forEach((m, i) => {
      if (m.from === 'ai') {
        timers.push(setTimeout(() => setTyping(true), delays[i]))
        timers.push(setTimeout(() => { setTyping(false); setVisible(i + 1) }, delays[i] + 750))
      } else {
        timers.push(setTimeout(() => setVisible(i + 1), delays[i]))
      }
    })
    return timers
  }, [])

  useEffect(() => {
    let t = run()
    const iv = setInterval(() => {
      t.forEach(clearTimeout)
      setVisible(0); setTyping(false)
      setTimeout(() => { t = run() }, 300)
    }, 11000)
    return () => { t.forEach(clearTimeout); clearInterval(iv) }
  }, [run])

  const handleEnter = () => {
    gsap.to(tiltRef.current, { rotateY: -3, rotateX: 2, duration: 0.6, ease: 'power2.out' })
  }
  const handleLeave = () => {
    gsap.to(tiltRef.current, { rotateY: -8, rotateX: 4, duration: 0.6, ease: 'power2.out' })
  }

  return (
    <div style={{ animation: 'card-float 5s ease-in-out infinite' }}>
      <div
        ref={tiltRef}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{ transform: 'rotateY(-8deg) rotateX(4deg)', transformStyle: 'preserve-3d', perspective: '1000px' }}
      >
        <div className="glass-hero rounded-[20px] w-[320px] overflow-hidden">
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="relative flex-shrink-0">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-semibold"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-primary)', fontFamily: 'DM Sans, sans-serif' }}
              >
                AI
              </div>
              <span
                className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                style={{ background: '#25D366', borderColor: '#080810', animation: 'pulse-dot 2s ease-in-out infinite' }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-semibold" style={{ color: 'var(--text-primary)' }}>Orda AI Agent</div>
              <div className="text-[10px] flex items-center gap-1.5" style={{ color: 'rgba(239,239,239,0.35)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
                Active · Instant replies
              </div>
            </div>
            <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="#25D366">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </div>

          {/* Messages */}
          <div className="px-3 py-3 space-y-2 min-h-[180px]">
            {CHAT.slice(0, visible).map((m, i) => (
              <div key={i} className={`flex ${m.from === 'c' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="px-3 py-1.5 text-[11px] leading-relaxed max-w-[82%]"
                  style={{
                    background: m.from === 'c' ? 'rgba(255,255,255,0.07)' : 'rgba(212,168,83,0.08)',
                    border: `1px solid ${m.from === 'c' ? 'rgba(255,255,255,0.07)' : 'rgba(212,168,83,0.15)'}`,
                    borderRadius: m.from === 'c' ? '12px 12px 3px 12px' : '12px 12px 12px 3px',
                    color: m.from === 'c' ? 'var(--text-primary)' : 'rgba(239,239,239,0.8)',
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div
                  className="px-3 py-2 rounded-xl rounded-bl-sm flex gap-1"
                  style={{ background: 'rgba(212,168,83,0.06)', border: '1px solid rgba(212,168,83,0.12)' }}
                >
                  {[0, 0.18, 0.36].map((d, j) => (
                    <span key={j} className="w-1.5 h-1.5 rounded-full block"
                      style={{ background: 'var(--accent)', animation: `dot-bounce 1.4s ease-in-out ${d}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className="px-4 py-2.5 flex items-center justify-between"
            style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
          >
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>avg reply &lt;1s</span>
            <div
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium"
              style={{ background: 'rgba(37,211,102,0.07)', border: '1px solid rgba(37,211,102,0.2)', color: '#25D366' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]"
                style={{ animation: 'pulse-dot 2s ease-in-out infinite' }} />
              online
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Hero() {
  const badgeRef = useRef<HTMLDivElement>(null)
  const line1Ref = useRef<HTMLDivElement>(null)
  const line2Ref = useRef<HTMLDivElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const btnsRef = useRef<HTMLDivElement>(null)
  const trustRef = useRef<HTMLParagraphElement>(null)
  const brainRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const startRef = useMagneticCursor<HTMLAnchorElement>(0.2)
  const seeRef = useMagneticCursor<HTMLAnchorElement>(0.2)

  useEffect(() => {
    const ease = 'cubic-bezier(0.23,1,0.32,1)'
    const tl = gsap.timeline({ delay: 0.3 })
    tl
      .fromTo(badgeRef.current, { opacity: 0, y: 12, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease })
      .fromTo(line1Ref.current, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 0.85, ease }, '-=0.1')
      .fromTo(line2Ref.current, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 0.85, ease }, '-=0.5')
      .fromTo(subRef.current, { opacity: 0, y: 16, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease }, '-=0.4')
      .fromTo(btnsRef.current, { opacity: 0, y: 14, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease }, '-=0.3')
      .fromTo(trustRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease }, '-=0.2')
      .fromTo(brainRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1.3, ease }, 0.4)
      .fromTo(cardRef.current, { opacity: 0, x: 20, y: 12, scale: 0.95 }, { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.9, ease }, '-=0.7')
  }, [])

  return (
    <section className="relative overflow-hidden pt-[60px]" style={{ minHeight: '100dvh', background: 'var(--bg-void)' }}>
      {/* Atmospheric orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full" style={{
          width: 900, height: 900, top: '-10%', left: '50%', transform: 'translateX(-50%)',
          background: 'radial-gradient(ellipse, rgba(212,168,83,0.05) 0%, transparent 65%)',
          filter: 'blur(180px)',
          animation: 'orb-breathe 10s ease-in-out infinite',
        }} />
        <div className="absolute rounded-full" style={{
          width: 600, height: 600, bottom: '-5%', left: '-5%',
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.03) 0%, transparent 65%)',
          filter: 'blur(140px)',
          animation: 'orb-breathe 14s ease-in-out infinite reverse',
        }} />
        <div className="absolute rounded-full" style={{
          width: 400, height: 400, top: '30%', right: '15%',
          background: 'radial-gradient(ellipse, rgba(212,168,83,0.04) 0%, transparent 65%)',
          filter: 'blur(120px)',
          animation: 'orb-breathe 8s ease-in-out infinite 2s',
        }} />
      </div>

      {/* 3D Brain — positioned right, behind content */}
      <div
        ref={brainRef}
        className="absolute pointer-events-none"
        style={{ right: '-2vw', top: '50%', transform: 'translateY(-50%)', zIndex: 1, opacity: 0 }}
      >
        <OrdaBrain size={560} />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32">
        {/* Badge */}
        <div ref={badgeRef} className="badge mb-10" style={{ opacity: 0 }}>
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: 'var(--accent)', animation: 'pulse-dot 2s ease-in-out infinite' }} />
          now live in 54 countries
        </div>

        {/* Headline — full-width, breaks the grid */}
        <div className="mb-10">
          <div className="overflow-hidden mb-1">
            <div
              ref={line1Ref}
              className="headline"
              style={{ fontSize: 'clamp(72px,12vw,160px)', clipPath: 'inset(100% 0 0 0)' }}
            >
              Every Customer.
            </div>
          </div>
          <div className="overflow-hidden">
            <div
              ref={line2Ref}
              className="headline-accent"
              style={{ fontSize: 'clamp(72px,12vw,160px)', clipPath: 'inset(100% 0 0 0)' }}
            >
              Always Answered.
            </div>
          </div>
        </div>

        {/* Body + CTA — left-aligned under headline */}
        <div className="max-w-[520px]">
          <p
            ref={subRef}
            className="font-body text-[17px] leading-[1.65] mb-8"
            style={{ color: 'var(--text-secondary)', opacity: 0 }}
          >
            Connect your WhatsApp. Get an AI agent that handles every customer message, takes orders, runs your store, and sends real notifications — automatically.
          </p>

          <div ref={btnsRef} className="flex flex-wrap gap-3 mb-5" style={{ opacity: 0 }}>
            <a ref={startRef} href="#" className="btn-primary px-8 py-4 text-[15px] gap-2">
              Start Free — 7 Days
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[2] flex-shrink-0">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a ref={seeRef} href="#how-it-works" className="btn-secondary px-8 py-4 text-[15px] gap-2">
              See It Work
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[2] flex-shrink-0">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </a>
          </div>

          <p ref={trustRef} className="font-body text-[12px]" style={{ color: 'var(--text-muted)', opacity: 0 }}>
            No credit card · 5 minute setup · Cancel anytime
          </p>
        </div>
      </div>

      {/* Chat card — floating over brain */}
      <div
        ref={cardRef}
        className="absolute z-20"
        style={{
          right: 'clamp(20px, 8vw, 140px)',
          bottom: 'clamp(40px, 10vh, 120px)',
          opacity: 0,
        }}
      >
        <ChatCard />
      </div>
    </section>
  )
}
