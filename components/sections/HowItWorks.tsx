'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    num: '01',
    title: 'Connect',
    desc: 'Scan one QR code. Your WhatsApp is live in 60 seconds.',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none stroke-2" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
        <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Build Your Store',
    desc: 'Add products, set prices, publish your store link anywhere.',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none stroke-2" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Grow',
    desc: 'AI handles everything. You just receive orders and get paid.',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none stroke-2" xmlns="http://www.w3.org/2000/svg">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
        <polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
  },
]

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<SVGPathElement>(null)
  const stepsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (!sectionRef.current) return

    gsap.fromTo(
      sectionRef.current.querySelector('.section-header'),
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
      }
    )

    stepsRef.current.forEach((step, i) => {
      if (!step) return
      gsap.fromTo(
        step,
        { opacity: 0, y: 70, rotation: 2 },
        {
          opacity: 1, y: 0, rotation: 0, duration: 0.8, ease: 'power3.out',
          delay: i * 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
        }
      )
    })

    if (lineRef.current) {
      const length = lineRef.current.getTotalLength?.() ?? 500
      gsap.set(lineRef.current, { strokeDasharray: length, strokeDashoffset: length })
      gsap.to(lineRef.current, {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' }
      })
    }
  }, [])

  return (
    <section ref={sectionRef} id="how-it-works" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="section-header text-center mb-20" style={{ opacity: 0 }}>
          <div className="inline-block px-4 py-1.5 rounded-full glass-card border border-accent/20 text-xs font-medium text-accent-light tracking-widest uppercase mb-4">
            How It Works
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-text-primary leading-tight">
            Up and Running in <span className="text-gradient-purple">60 Seconds</span>
          </h2>
        </div>

        <div className="relative">
          {/* Connecting line on desktop */}
          <div className="hidden lg:block absolute top-16 left-[16.66%] right-[16.66%] h-px">
            <svg className="w-full h-4" viewBox="0 0 800 4" preserveAspectRatio="none">
              <path
                ref={lineRef}
                d="M0,2 L800,2"
                stroke="rgba(135,41,160,0.5)"
                strokeWidth="2"
                strokeDasharray="8 6"
                fill="none"
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div
                key={step.num}
                ref={(el) => { if (el) stepsRef.current[i] = el }}
                className="glass-card rounded-3xl p-8 flex flex-col gap-6 relative group hover:-translate-y-2 transition-transform duration-300"
                style={{ opacity: 0 }}
              >
                {/* Step number - large background */}
                <div className="absolute -top-4 -right-4 text-8xl font-black text-white/[0.04] leading-none select-none pointer-events-none">
                  {step.num}
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/20 flex items-center justify-center text-accent-light">
                  {step.icon}
                </div>

                {/* Number badge */}
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-black text-gradient-purple">{step.num}</span>
                  <div className="w-8 h-px bg-accent/30" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-text-primary mb-3">{step.title}</h3>
                  <p className="text-text-muted leading-relaxed">{step.desc}</p>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-3xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
