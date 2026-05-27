'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const QR_PATTERN = [
  1,1,1,1,1,1,1,
  1,0,0,0,0,0,1,
  1,0,1,1,1,0,1,
  1,0,1,0,1,0,1,
  1,0,1,1,1,0,1,
  1,0,0,0,0,0,1,
  1,1,1,1,1,1,1,
]

function PhoneConnect() {
  return (
    <div className="phone-frame mx-auto flex flex-col items-center justify-center gap-4 p-6">
      <div className="mt-8 text-center">
        <div
          className="font-body text-[10px] uppercase mb-3 tracking-widest"
          style={{ color: 'rgba(239,239,239,0.3)' }}
        >
          Scan to Connect
        </div>
        <div className="w-28 h-28 mx-auto rounded-xl bg-white p-2 flex items-center justify-center">
          <div className="w-full h-full grid grid-cols-7 gap-px">
            {QR_PATTERN.map((cell, i) => (
              <div key={i} className={`rounded-[1px] ${cell ? 'bg-black' : 'bg-white'}`} />
            ))}
          </div>
        </div>
        <div
          className="mt-4 px-3 py-1.5 rounded-full font-body text-[10px] font-semibold flex items-center gap-1.5 w-fit mx-auto"
          style={{ background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.25)', color: '#25D366' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" style={{ animation: 'pulse-dot 2s ease-in-out infinite' }} />
          Live in 60 seconds
        </div>
      </div>
      <div className="absolute bottom-10 left-0 right-0 px-4">
        <div className="glass-surface rounded-xl p-3 text-center" style={{ border: '1px solid rgba(37,211,102,0.15)' }}>
          <div className="font-body text-[10px]" style={{ color: 'var(--text-muted)' }}>WhatsApp connected</div>
          <div className="font-body text-[11px] font-semibold mt-0.5" style={{ color: '#25D366' }}>+1 (555) 000-0000 ✓</div>
        </div>
      </div>
    </div>
  )
}

function PhoneStore() {
  const products = [
    { name: 'Black Bomber Jacket', price: '$89', hot: true },
    { name: 'Premium Hoodie', price: '$64', hot: false },
    { name: 'Classic Sneakers', price: '$120', hot: false },
  ]
  return (
    <div className="phone-frame mx-auto overflow-y-auto">
      <div className="mt-6 px-3">
        <div className="font-body text-[10px] uppercase text-center mb-1 tracking-widest" style={{ color: 'var(--text-muted)' }}>
          Orda Store
        </div>
        <div className="font-display text-[13px] font-bold text-center mb-4" style={{ color: 'var(--text-primary)' }}>
          My Store
        </div>
        <div className="space-y-2">
          {products.map((p) => (
            <div key={p.name} className="glass-surface rounded-xl p-3 flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex-shrink-0"
                style={{ background: 'rgba(212,168,83,0.1)', border: '1px solid rgba(212,168,83,0.15)' }}
              />
              <div className="flex-1 min-w-0">
                <div className="font-body text-[11px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{p.name}</div>
                <div className="font-body text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{p.price}</div>
              </div>
              {p.hot && (
                <span
                  className="font-body text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
                  style={{ background: 'rgba(212,168,83,0.1)', color: 'var(--accent)', border: '1px solid rgba(212,168,83,0.2)' }}
                >
                  Hot
                </span>
              )}
            </div>
          ))}
        </div>
        <button
          className="btn-primary w-full mt-4 py-3 font-body text-[11px]"
          style={{ borderRadius: '12px' }}
        >
          Share Store Link
        </button>
      </div>
    </div>
  )
}

function PhoneGrow() {
  const msgs = [
    { from: 'c', text: 'Hi, is the black jacket still available?' },
    { from: 'ai', text: 'Yes, we have 3 left. Want me to reserve one?' },
    { from: 'c', text: 'Please yes' },
    { from: 'ai', text: 'Reserved. Payment link sent ✓' },
  ]
  return (
    <div className="phone-frame mx-auto flex flex-col">
      <div className="mt-6 px-3 flex-1 space-y-2">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.from === 'c' ? 'justify-end' : 'justify-start'}`}>
            <div
              className="px-2.5 py-1.5 font-body text-[10px] max-w-[80%]"
              style={{
                background: m.from === 'c' ? 'rgba(255,255,255,0.07)' : 'rgba(212,168,83,0.08)',
                border: `1px solid ${m.from === 'c' ? 'rgba(255,255,255,0.07)' : 'rgba(212,168,83,0.15)'}`,
                borderRadius: m.from === 'c' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
                color: 'var(--text-primary)',
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div
        className="absolute bottom-14 left-3 right-3 glass-surface rounded-xl p-3"
        style={{ border: '1px solid rgba(37,211,102,0.2)', animation: 'notification-drop 0.4s cubic-bezier(0.23,1,0.32,1) 2s both' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(37,211,102,0.1)' }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-[#25D366] stroke-2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-body text-[9px]" style={{ color: 'var(--text-muted)' }}>New Order #1042</div>
            <div className="font-body text-[10px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
              Black Bomber Jacket × 1 — $89
            </div>
          </div>
          <span className="font-body text-[8px] font-bold" style={{ color: '#25D366' }}>PAID</span>
        </div>
      </div>
    </div>
  )
}

const chapters = [
  {
    num: '01', label: 'STEP 01',
    headline: 'Connect Your WhatsApp.',
    body: 'Scan one QR code. Your WhatsApp Business number goes live in 60 seconds. No API keys. No developer needed.',
    phone: <PhoneConnect />,
  },
  {
    num: '02', label: 'STEP 02',
    headline: 'Add Your Products.',
    body: 'Tell Orda what you sell. Set prices. The AI knows your entire catalog instantly. Share your link everywhere.',
    phone: <PhoneStore />,
  },
  {
    num: '03', label: 'STEP 03',
    headline: 'Watch It Work.',
    body: 'Every message answered. Every order captured. Every payment collected. Automatically.',
    phone: <PhoneGrow />,
  },
]

export default function Story() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const chaptersRef = useRef<HTMLDivElement[]>([])
  const phonesRef = useRef<HTMLDivElement[]>([])
  const numsRef = useRef<HTMLDivElement[]>([])
  const dotsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const total = chapters.length
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: 'top top',
        end: `+=${total * 100}%`,
        pin: stickyRef.current,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress
          const idx = Math.min(Math.floor(progress * total), total - 1)

          chaptersRef.current.forEach((el, i) => {
            if (!el) return
            if (i === idx) gsap.to(el, { opacity: 1, y: 0, duration: 0.4, ease: 'cubic-bezier(0.23,1,0.32,1)' })
            else if (i < idx) gsap.to(el, { opacity: 0, y: -40, duration: 0.25, ease: 'cubic-bezier(0.23,1,0.32,1)' })
            else gsap.to(el, { opacity: 0, y: 40, duration: 0.25 })
          })

          phonesRef.current.forEach((el, i) => {
            if (!el) return
            if (i === idx) gsap.to(el, { opacity: 1, scale: 1, rotationY: 0, duration: 0.5, ease: 'cubic-bezier(0.23,1,0.32,1)' })
            else gsap.to(el, { opacity: 0, scale: 0.88, rotationY: i < idx ? -20 : 20, duration: 0.3 })
          })

          numsRef.current.forEach((el, i) => {
            if (!el) return
            gsap.to(el, { opacity: i === idx ? 1 : 0, duration: 0.3 })
          })

          dotsRef.current.forEach((el, i) => {
            if (!el) return
            el.style.background = i === idx ? 'var(--accent)' : 'rgba(255,255,255,0.15)'
          })
        },
      })
    }, wrapperRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={wrapperRef} id="how-it-works" style={{ height: `${(chapters.length + 1) * 100}vh` }} className="relative">
      <div ref={stickyRef} className="h-screen flex items-center" style={{ background: 'var(--bg-void)' }}>
        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative">

          {/* Chapter numbers — enormous architectural background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {chapters.map((ch, i) => (
              <div
                key={i}
                ref={el => { if (el) numsRef.current[i] = el }}
                className="absolute font-display font-[900] select-none"
                style={{
                  fontSize: '30vw',
                  lineHeight: 1,
                  letterSpacing: '-0.06em',
                  color: 'rgba(255,255,255,0.018)',
                  top: '50%',
                  left: '-2vw',
                  transform: 'translateY(-50%)',
                  opacity: i === 0 ? 1 : 0,
                }}
              >
                {ch.num}
              </div>
            ))}
          </div>

          {/* Left — text */}
          <div className="relative" style={{ height: 280 }}>
            <div className="label-pill mb-8" style={{ position: 'relative', zIndex: 2 }}>How It Works</div>
            {chapters.map((ch, i) => (
              <div
                key={i}
                ref={el => { if (el) chaptersRef.current[i] = el }}
                className="absolute top-12 left-0 right-0"
                style={{ opacity: i === 0 ? 1 : 0, transform: i === 0 ? 'none' : 'translateY(40px)' }}
              >
                <div
                  className="font-body text-[10px] uppercase tracking-[0.14em] mb-4 font-medium"
                  style={{ color: 'var(--accent)' }}
                >
                  {ch.label}
                </div>
                <h2
                  className="font-display font-[900] leading-[0.9] tracking-[-0.04em] mb-5"
                  style={{ fontSize: 'clamp(28px,3.5vw,48px)', color: 'var(--text-primary)' }}
                >
                  {ch.headline}
                </h2>
                <p className="font-body text-[16px] leading-relaxed max-w-md" style={{ color: 'var(--text-secondary)' }}>
                  {ch.body}
                </p>
              </div>
            ))}
          </div>

          {/* Right — phones */}
          <div className="relative flex items-center justify-center" style={{ height: 480 }}>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-80 h-80 rounded-full" style={{
                background: 'radial-gradient(ellipse, rgba(212,168,83,0.08) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }} />
            </div>
            {chapters.map((ch, i) => (
              <div
                key={i}
                ref={el => { if (el) phonesRef.current[i] = el }}
                className="absolute"
                style={{ opacity: i === 0 ? 1 : 0, transformStyle: 'preserve-3d' }}
              >
                {ch.phone}
              </div>
            ))}
          </div>
        </div>

        {/* Chapter dots */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3">
          {chapters.map((_, i) => (
            <div
              key={i}
              ref={el => { dotsRef.current[i] = el }}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: i === 0 ? 'var(--accent)' : 'rgba(255,255,255,0.15)',
                transition: 'background 300ms cubic-bezier(0.23,1,0.32,1)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
