'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import dynamic from 'next/dynamic'
import { useMagneticCursor } from '@/hooks/useMagneticCursor'
import { AuroraStaticBackground } from '@/components/ui/aurora-background'

gsap.registerPlugin(ScrollTrigger)

const OrdaBrain = dynamic(() => import('@/components/three/OrdaBrain'), { ssr: false })

export default function CTA() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const brainRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const btnRef = useMagneticCursor<HTMLAnchorElement>(0.2)

  useEffect(() => {
    if (!sectionRef.current) return
    gsap.fromTo(brainRef.current,
      { opacity: 0, scale: 0.85 },
      { opacity: 1, scale: 1, duration: 1.4, ease: 'cubic-bezier(0.23,1,0.32,1)',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
    )
    gsap.fromTo(textRef.current,
      { opacity: 0, y: 40, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'cubic-bezier(0.23,1,0.32,1)', delay: 0.3,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
    )
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center justify-center overflow-hidden"
      style={{ minHeight: '100dvh', background: 'var(--bg-void)' }}
    >
      {/* Aurora background */}
      <AuroraStaticBackground />

      {/* 3D Brain — 80vw centered behind text */}
      <div
        ref={brainRef}
        className="absolute pointer-events-none"
        style={{
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80vmin', height: '80vmin',
          opacity: 0,
          zIndex: 1,
        }}
      >
        <OrdaBrain size={600} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-32">
        <div ref={textRef} className="flex flex-col items-center gap-8" style={{ opacity: 0 }}>
          <div className="label-pill">Get Started Today</div>

          <div>
            <div
              className="font-display font-[900] leading-[0.88] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(56px,8vw,100px)', color: 'var(--text-primary)' }}
            >
              Your Business Never
            </div>
            <div
              className="font-display font-[900] leading-[0.88] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(56px,8vw,100px)', color: 'var(--accent)' }}
            >
              Stops Working.
            </div>
          </div>

          <p className="font-body text-[17px] max-w-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Join 500+ businesses already running on Orda.
          </p>

          <div className="relative">
            <div
              className="absolute inset-0 rounded-lg blur-xl pointer-events-none"
              style={{
                background: 'rgba(212,168,83,0.35)',
                transform: 'scale(1.1) translateY(4px)',
                animation: 'orb-breathe 3s ease-in-out infinite',
              }}
            />
            <a ref={btnRef} href="#" className="btn-primary relative px-14 py-5 text-[17px] font-semibold gap-3">
              Get Started Free — 7 Days →
            </a>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            {['No credit card', '5 minute setup', 'Cancel anytime'].map((t, i) => (
              <span key={t} className="flex items-center gap-2 font-body text-[13px]" style={{ color: 'var(--text-muted)' }}>
                {i > 0 && <span className="w-1 h-1 rounded-full" style={{ background: 'var(--border-default)' }} />}
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-2 flex-shrink-0" style={{ stroke: 'var(--accent)' }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
