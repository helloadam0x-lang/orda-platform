'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import dynamic from 'next/dynamic'

gsap.registerPlugin(ScrollTrigger)

const OrdaSphere = dynamic(() => import('@/components/ui/OrdaSphere'), { ssr: false })

export default function FinalCTA() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const sphereRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    gsap.fromTo(
      sphereRef.current,
      { opacity: 0, scale: 0.7 },
      {
        opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
      }
    )

    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 0.9, ease: 'power2.out',
        delay: 0.3,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
      }
    )
  }, [])

  return (
    <section ref={sectionRef} className="py-32 relative overflow-hidden min-h-[80vh] flex items-center">
      {/* Background sphere glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-accent/10 blur-[100px]" />
      </div>

      {/* 3D Sphere — large and centered behind */}
      <div
        ref={sphereRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ opacity: 0 }}
      >
        <div className="w-[700px] h-[700px]">
          <OrdaSphere large />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        <div
          ref={textRef}
          className="flex flex-col items-center gap-8"
          style={{ opacity: 0 }}
        >
          <div className="inline-block px-4 py-1.5 rounded-full glass-card border border-accent/20 text-xs font-medium text-accent-light tracking-widest uppercase">
            Get Started Today
          </div>

          <h2 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight">
            <span className="block text-text-primary">Your Business Never</span>
            <span className="block text-gradient-purple">Stops Working.</span>
          </h2>

          <p className="text-xl text-text-muted max-w-2xl leading-relaxed">
            Join 500+ businesses across 54 countries who never miss a customer message. Start your 7-day free trial now.
          </p>

          <a
            href="#"
            className="btn-primary px-12 py-5 rounded-full font-bold text-lg text-white flex items-center gap-3 group"
          >
            Get Started Free
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 fill-none stroke-current stroke-2 group-hover:translate-x-1 transition-transform duration-200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>

          <p className="text-sm text-text-muted flex items-center gap-3 flex-wrap justify-center">
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-accent-light stroke-2" xmlns="http://www.w3.org/2000/svg">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              No credit card
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-accent-light stroke-2" xmlns="http://www.w3.org/2000/svg">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              5 minute setup
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-accent-light stroke-2" xmlns="http://www.w3.org/2000/svg">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Cancel anytime
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}
