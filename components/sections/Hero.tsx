'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import dynamic from 'next/dynamic'
import AIConversationCard from '@/components/ui/AIConversationCard'

const OrdaSphere = dynamic(() => import('@/components/ui/OrdaSphere'), { ssr: false })

export default function Hero() {
  const badgeRef = useRef<HTMLDivElement>(null)
  const h1Ref = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const btnsRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const sphereRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.4 })
    tl.fromTo(badgeRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
      .fromTo(h1Ref.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.2')
      .fromTo(subRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
      .fromTo(btnsRef.current, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      .fromTo(statsRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
      .fromTo(sphereRef.current, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }, 0.3)
      .fromTo(cardRef.current, { opacity: 0, y: 30, x: 20 }, { opacity: 1, y: 0, x: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5')
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
        {/* Left — Text Content */}
        <div className="flex flex-col gap-7 z-10">
          {/* Badge */}
          <div ref={badgeRef} className="inline-flex items-center gap-2 w-fit" style={{ opacity: 0 }}>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-accent/30">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse_ring" />
              <span className="text-sm font-medium text-accent-light tracking-wide">Now live in 54 countries</span>
            </div>
          </div>

          {/* Headline */}
          <h1
            ref={h1Ref}
            className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight"
            style={{ opacity: 0 }}
          >
            <span className="block text-text-primary">Every Customer.</span>
            <span className="block text-gradient-purple">Always Answered.</span>
          </h1>

          {/* Subtext */}
          <p
            ref={subRef}
            className="text-lg text-text-muted max-w-lg leading-relaxed"
            style={{ opacity: 0 }}
          >
            Connect your WhatsApp and get an AI agent that handles every customer message automatically. Takes orders. Sends notifications. Runs your store. While you sleep.
          </p>

          {/* Buttons */}
          <div ref={btnsRef} className="flex flex-wrap gap-4" style={{ opacity: 0 }}>
            <a
              href="#"
              className="btn-primary px-8 py-4 rounded-full font-semibold text-base text-white flex items-center gap-2"
            >
              Start Free — 7 Days
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a
              href="#how-it-works"
              className="btn-secondary px-8 py-4 rounded-full font-semibold text-base text-text-primary flex items-center gap-2"
            >
              See It Work
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2" xmlns="http://www.w3.org/2000/svg">
                <polygon points="5,3 19,12 5,21"/>
              </svg>
            </a>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="flex flex-wrap gap-6 pt-2" style={{ opacity: 0 }}>
            {[
              { value: '2M+', label: 'Messages' },
              { value: '54', label: 'Countries' },
              { value: '500+', label: 'Businesses' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div>
                  <div className="text-2xl font-black text-text-primary leading-none">{stat.value}</div>
                  <div className="text-xs text-text-muted mt-0.5">{stat.label}</div>
                </div>
                <div className="w-px h-8 bg-white/10 last:hidden" />
              </div>
            ))}
          </div>
        </div>

        {/* Right — 3D Sphere + Card */}
        <div className="relative flex items-center justify-center h-[560px] lg:h-[640px]">
          {/* Sphere */}
          <div
            ref={sphereRef}
            className="absolute inset-0 z-0"
            style={{ opacity: 0 }}
          >
            <OrdaSphere className="w-full h-full" />
          </div>

          {/* Glow behind sphere */}
          <div className="absolute inset-0 bg-radial-gradient pointer-events-none z-0"
            style={{ background: 'radial-gradient(ellipse 60% 60% at 60% 50%, rgba(135,41,160,0.2) 0%, transparent 70%)' }}
          />

          {/* Floating conversation card */}
          <div
            ref={cardRef}
            className="absolute bottom-8 left-0 md:-left-8 z-20 animate-float"
            style={{ opacity: 0 }}
          >
            <AIConversationCard />
          </div>
        </div>
      </div>
    </section>
  )
}
