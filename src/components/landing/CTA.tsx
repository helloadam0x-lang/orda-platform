'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import dynamic from 'next/dynamic'
import { useMagneticCursor } from '@/hooks/useMagneticCursor'

gsap.registerPlugin(ScrollTrigger)

const OrdaSphere = dynamic(() => import('@/components/three/OrdaSphere'), { ssr: false })

export default function CTA() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const sphereRef = useRef<HTMLDivElement>(null)
  const btnRef = useMagneticCursor<HTMLAnchorElement>(0.45)

  useEffect(() => {
    if (!sectionRef.current) return
    gsap.fromTo(sphereRef.current, { opacity: 0, scale: 0.7 }, {
      opacity: 1, scale: 1, duration: 1.3, ease: 'power2.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
    })
    gsap.fromTo(textRef.current, { opacity: 0, y: 50 }, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.25,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
    })
  }, [])

  return (
    <section ref={sectionRef} className="relative py-40 overflow-hidden min-h-[80vh] flex items-center">
      {/* Ambient deep glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(135,41,160,0.14) 0%, transparent 65%)' }} />
      </div>

      {/* Sphere */}
      <div ref={sphereRef} className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: 0 }}>
        <div className="w-[800px] h-[800px]">
          <OrdaSphere large />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        <div ref={textRef} className="flex flex-col items-center gap-8" style={{ opacity: 0 }}>
          <div className="label-pill">Get Started Today</div>

          <div>
            <div className="text-[clamp(52px,8vw,96px)] font-black leading-[0.9] tracking-tight text-white">
              Your Business Never
            </div>
            <div className="text-[clamp(52px,8vw,96px)] font-black leading-[0.9] tracking-tight text-gradient">
              Stops Working.
            </div>
          </div>

          <p className="text-[18px] text-white/40 max-w-xl leading-relaxed">
            Join 500+ businesses across 54 countries. Your AI agent is ready in 5 minutes.
          </p>

          <a ref={btnRef} href="#"
            className="btn-cta px-14 py-5 rounded-full font-bold text-[18px] text-white flex items-center gap-3 group">
            Get Started Free — 7 Days →
          </a>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            {['No credit card', '5 minute setup', 'Cancel anytime'].map((t, i) => (
              <span key={t} className="flex items-center gap-2 text-[13px] text-white/30">
                {i > 0 && <span className="w-1 h-1 rounded-full bg-white/15" />}
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-[#C084FC] stroke-2"><polyline points="20 6 9 17 4 12"/></svg>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
