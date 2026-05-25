'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import dynamic from 'next/dynamic'
import { useMagneticCursor } from '@/hooks/useMagneticCursor'

const OrdaSphere = dynamic(() => import('@/components/three/OrdaSphere'), { ssr: false })

const chatMessages = [
  { from: 'customer', text: 'Hi! Do you have the Jordan 1 in size 43?' },
  { from: 'ai', text: 'Yes! 2 pairs left in size 43. Want me to reserve one?' },
  { from: 'customer', text: 'Yes! How much?' },
  { from: 'ai', text: '₦89,000 with free delivery. Payment link sent ✓' },
]

function AICard() {
  const [visible, setVisible] = useState(0)
  const [typing, setTyping] = useState(false)

  const run = useCallback(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    const delays = [0, 1500, 3000, 4500]
    chatMessages.forEach((msg, i) => {
      if (msg.from === 'ai') {
        timers.push(setTimeout(() => setTyping(true), delays[i]))
        timers.push(setTimeout(() => { setTyping(false); setVisible(i + 1) }, delays[i] + 900))
      } else {
        timers.push(setTimeout(() => setVisible(i + 1), delays[i]))
      }
    })
    return timers
  }, [])

  useEffect(() => {
    let t = run()
    const iv = setInterval(() => { t.forEach(clearTimeout); setVisible(0); setTyping(false); setTimeout(() => { t = run() }, 300) }, 10000)
    return () => { t.forEach(clearTimeout); clearInterval(iv) }
  }, [run])

  return (
    <div className="glass glow-card rounded-2xl p-4 w-72 shadow-2xl" style={{ animation: 'float 6s ease-in-out infinite' }}>
      <div className="flex items-center gap-2.5 pb-3 mb-3 border-b border-white/5">
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8729A0] to-[#C084FC] flex items-center justify-center text-[10px] font-black text-white">AI</div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#08080C]" style={{ animation: 'pulse-glow 2s ease-in-out infinite' }} />
        </div>
        <div>
          <div className="text-[12px] font-semibold text-white">Orda AI Agent</div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Active · Instant replies
          </div>
        </div>
        <svg viewBox="0 0 24 24" className="w-4 h-4 ml-auto" fill="#25D366">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </div>

      <div className="space-y-2 min-h-[120px]">
        {chatMessages.slice(0, visible).map((m, i) => (
          <div key={i} className={`flex ${m.from === 'customer' ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-3 py-2 rounded-xl text-[11px] leading-relaxed max-w-[82%]
              ${m.from === 'customer' ? 'bg-[#8729A0]/30 border border-[#8729A0]/20 rounded-br-sm' : 'bg-white/5 border border-white/[0.07] rounded-bl-sm'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="px-3 py-2.5 rounded-xl rounded-bl-sm bg-white/5 border border-white/[0.07] flex gap-1">
              {[0, 0.18, 0.36].map((d, i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#C084FC] block"
                  style={{ animation: `dot-bounce 1.4s ease-in-out ${d}s infinite` }} />
              ))}
            </div>
          </div>
        )}
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
  const statsRef = useRef<HTMLDivElement>(null)
  const sphereRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const startRef = useMagneticCursor<HTMLAnchorElement>(0.4)
  const seeRef = useMagneticCursor<HTMLAnchorElement>(0.4)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 })
    tl.fromTo(badgeRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
      .fromTo(line1Ref.current, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 0.8, ease: 'power4.out' }, '-=0.1')
      .fromTo(line2Ref.current, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 0.8, ease: 'power4.out' }, '-=0.5')
      .fromTo(subRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
      .fromTo(btnsRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      .fromTo(statsRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
      .fromTo(sphereRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, 0.4)
      .fromTo(cardRef.current, { opacity: 0, x: 24, y: 16 }, { opacity: 1, x: 0, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Deep radial glow — extracted from Perplexity/Nvidia dark terrain */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-[20%] -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(135,41,160,0.18) 0%, transparent 65%)' }} />
        <div className="absolute bottom-0 inset-x-0 h-48"
          style={{ background: 'linear-gradient(to top, #08080C, transparent)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20">
        {/* Left */}
        <div className="flex flex-col gap-7 z-10">
          <div ref={badgeRef} className="label-pill w-fit" style={{ opacity: 0 }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: 'pulse-glow 2s ease-in-out infinite' }} />
            Now live in 54 countries
          </div>

          <div className="flex flex-col gap-2">
            <div className="overflow-hidden">
              <div ref={line1Ref} className="text-[clamp(48px,6.5vw,80px)] font-black leading-[0.93] tracking-[-0.03em] text-white"
                style={{ clipPath: 'inset(100% 0 0 0)' }}>
                Every Customer.
              </div>
            </div>
            <div className="overflow-hidden">
              <div ref={line2Ref} className="text-[clamp(48px,6.5vw,80px)] font-black leading-[0.93] tracking-[-0.03em] text-gradient"
                style={{ clipPath: 'inset(100% 0 0 0)' }}>
                Always Answered.
              </div>
            </div>
          </div>

          <p ref={subRef} className="text-[17px] text-white/45 max-w-[480px] leading-[1.7]" style={{ opacity: 0 }}>
            Connect your WhatsApp. Get an AI agent that handles every customer message, takes orders, runs your store, and sends real notifications — automatically.
          </p>

          <div ref={btnsRef} className="flex flex-wrap gap-3" style={{ opacity: 0 }}>
            <a ref={startRef} href="#"
              className="btn-cta px-8 py-4 rounded-full font-semibold text-[15px] text-white flex items-center gap-2">
              Start Free — 7 Days
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a ref={seeRef} href="#how-it-works"
              className="btn-ghost px-8 py-4 rounded-full font-semibold text-[15px] text-white/80 flex items-center gap-2">
              See It Work
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2"><polygon points="5,3 19,12 5,21"/></svg>
            </a>
          </div>

          <div ref={statsRef} className="flex flex-wrap gap-0 divide-x divide-white/[0.07]" style={{ opacity: 0 }}>
            {[['2M+', 'Messages'], ['54', 'Countries'], ['500+', 'Businesses']].map(([v, l]) => (
              <div key={l} className="flex flex-col gap-0.5 px-6 first:pl-0 last:pr-0">
                <span className="text-[28px] font-black text-white leading-none tracking-tight">{v}</span>
                <span className="text-[11px] text-white/35 tracking-widest uppercase font-medium">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="relative h-[580px] lg:h-[660px] flex items-center justify-center">
          <div ref={sphereRef} className="absolute inset-0" style={{ opacity: 0 }}>
            <OrdaSphere />
          </div>
          <div ref={cardRef} className="absolute bottom-8 -left-4 lg:-left-12 z-20" style={{ opacity: 0 }}>
            <AICard />
          </div>
        </div>
      </div>
    </section>
  )
}
