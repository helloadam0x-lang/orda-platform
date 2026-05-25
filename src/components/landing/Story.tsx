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
        <div className="text-[10px] text-white/35 tracking-widest uppercase mb-3">Scan to Connect</div>
        {/* QR Code placeholder */}
        <div className="w-28 h-28 mx-auto rounded-xl bg-white p-2 flex items-center justify-center">
          <div className="w-full h-full grid grid-cols-7 gap-px">
            {QR_PATTERN.map((cell, i) => (
              <div key={i} className={`rounded-[1px] ${cell ? 'bg-black' : 'bg-white'}`} />
            ))}
          </div>
        </div>
        <div className="mt-4 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold flex items-center gap-1.5 w-fit mx-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: 'pulse-glow 2s ease-in-out infinite' }} />
          Live in 60 seconds
        </div>
      </div>
      <div className="absolute bottom-12 left-0 right-0 px-4">
        <div className="glass rounded-xl p-3 text-center border border-emerald-500/20">
          <div className="text-[10px] text-white/50">WhatsApp connected</div>
          <div className="text-[11px] font-semibold text-emerald-400 mt-0.5">+1 (555) 000-0000 ✓</div>
        </div>
      </div>
    </div>
  )
}

function PhoneStore() {
  const products = [
    { name: 'Air Jordan 1', price: '₦89,000', badge: 'Hot' },
    { name: 'Nike Air Max', price: '₦64,000' },
    { name: 'Adidas Yeezy', price: '₦120,000', badge: 'New' },
  ]
  return (
    <div className="phone-frame mx-auto overflow-y-auto">
      <div className="mt-6 px-3">
        <div className="text-[10px] text-white/40 tracking-widest uppercase text-center mb-1">Orda Store</div>
        <div className="text-[13px] font-black text-white text-center mb-4">KickSpace Lagos</div>
        <div className="space-y-2">
          {products.map((p) => (
            <div key={p.name} className="glass rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8729A0]/30 to-[#C084FC]/20 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold text-white truncate">{p.name}</div>
                <div className="text-[10px] text-white/45 mt-0.5">{p.price}</div>
              </div>
              {p.badge && (
                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-[#8729A0]/30 text-[#C084FC] border border-[#8729A0]/20">
                  {p.badge}
                </span>
              )}
            </div>
          ))}
        </div>
        <button className="btn-cta w-full mt-4 py-3 rounded-xl text-[11px] font-semibold text-white">
          Share Store Link
        </button>
      </div>
    </div>
  )
}

function PhoneAI() {
  const msgs = [
    { from: 'c', text: 'Do you have size 42?' },
    { from: 'ai', text: 'Yes! 2 pairs left. Reserve?' },
    { from: 'c', text: 'Yes!' },
    { from: 'ai', text: 'Reserved ✓ Pay link sent' },
  ]
  return (
    <div className="phone-frame mx-auto flex flex-col">
      <div className="mt-6 px-3 flex-1 space-y-2">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.from === 'c' ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-2.5 py-1.5 rounded-xl text-[10px] max-w-[80%]
              ${m.from === 'c' ? 'bg-[#8729A0]/30 text-white rounded-br-sm' : 'bg-white/8 text-white rounded-bl-sm'}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      {/* Notification drop */}
      <div className="absolute bottom-16 left-3 right-3 glass rounded-xl p-3 border border-emerald-500/25"
        style={{ animation: 'notification-drop 0.4s ease-out 2s both' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-emerald-400 stroke-2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[9px] text-white/40 font-medium">New Order #1042</div>
            <div className="text-[10px] font-semibold text-white truncate">Air Jordan 1 × 1 — ₦89,000</div>
          </div>
          <span className="text-[8px] text-emerald-400 font-semibold">PAID</span>
        </div>
      </div>
    </div>
  )
}

const chapters = [
  {
    num: '01',
    headline: 'Connect in 60 seconds.',
    body: 'Scan one QR code. Your WhatsApp number is live. No API keys. No developer needed.',
    phone: <PhoneConnect />,
  },
  {
    num: '02',
    headline: 'Build your store. Share one link.',
    body: 'Add products, set prices, and publish your storefront in minutes. Share the link on TikTok, WhatsApp, Instagram — anywhere.',
    phone: <PhoneStore />,
  },
  {
    num: '03',
    headline: 'Your AI never stops working.',
    body: 'Every message answered instantly. Every order captured. Shopify-style notifications fire to you and your staff automatically.',
    phone: <PhoneAI />,
  },
]

export default function Story() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const chaptersRef = useRef<HTMLDivElement[]>([])
  const phonesRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const totalChapters = chapters.length

      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: 'top top',
        end: `+=${totalChapters * 100}%`,
        pin: stickyRef.current,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress
          const chapterIndex = Math.min(Math.floor(progress * totalChapters), totalChapters - 1)
          chaptersRef.current.forEach((el, i) => {
            if (!el) return
            if (i === chapterIndex) {
              gsap.to(el, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' })
            } else if (i < chapterIndex) {
              gsap.to(el, { opacity: 0, y: -40, duration: 0.3, ease: 'power2.in' })
            } else {
              gsap.to(el, { opacity: 0, y: 40, duration: 0.3 })
            }
          })

          phonesRef.current.forEach((el, i) => {
            if (!el) return
            if (i === chapterIndex) {
              gsap.to(el, { opacity: 1, scale: 1, rotationY: 0, duration: 0.5, ease: 'power2.out' })
            } else {
              gsap.to(el, { opacity: 0, scale: 0.88, rotationY: i < chapterIndex ? -20 : 20, duration: 0.35 })
            }
          })
        },
      })
    }, wrapperRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={wrapperRef} id="how-it-works" style={{ height: `${(chapters.length + 1) * 100}vh` }} className="relative">
      <div ref={stickyRef} className="h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — text */}
          <div className="relative h-64">
            <div className="label-pill mb-8">How It Works</div>
            {chapters.map((ch, i) => (
              <div
                key={i}
                ref={el => { if (el) chaptersRef.current[i] = el }}
                className="absolute top-10 left-0 right-0"
                style={{ opacity: i === 0 ? 1 : 0, transform: i === 0 ? 'none' : 'translateY(40px)' }}
              >
                <span className="text-[clamp(72px,12vw,140px)] font-black leading-none text-white/[0.04] absolute -top-6 -left-2 select-none pointer-events-none">
                  {ch.num}
                </span>
                <div className="relative">
                  <h2 className="text-[clamp(28px,3.5vw,44px)] font-black text-white leading-tight tracking-tight mb-4">
                    {ch.headline}
                  </h2>
                  <p className="text-[16px] text-white/45 leading-relaxed max-w-md">{ch.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right — phones */}
          <div className="relative h-[480px] flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-80 h-80 rounded-full"
                style={{ background: 'radial-gradient(ellipse, rgba(135,41,160,0.15) 0%, transparent 70%)' }} />
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

        {/* Chapter indicators */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3">
          {chapters.map((_, i) => (
            <div key={i} className="w-1 h-8 rounded-full bg-white/10 overflow-hidden">
              <div className="w-full h-0 bg-[#C084FC] rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
