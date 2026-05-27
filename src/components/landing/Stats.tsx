'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { NumberTicker } from '@/components/ui/number-ticker'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: 2_000_000, suffix: '+', label: 'Messages Handled' },
  { value: 54, suffix: '', label: 'Countries' },
  { value: 500, suffix: '+', label: 'Businesses' },
]

export default function Stats() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 30, scale: 0.97 },
      {
        opacity: 1, y: 0, scale: 1, duration: 0.9,
        ease: 'cubic-bezier(0.23,1,0.32,1)',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' },
      }
    )
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-24"
      style={{
        opacity: 0,
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-0">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="flex-1 flex justify-center"
              style={i > 0 ? { borderLeft: '1px solid var(--border-subtle)' } : {}}
            >
              <div className="flex flex-col items-center gap-3 px-16 first:pl-0 last:pr-0">
                <NumberTicker
                  value={s.value}
                  suffix={s.suffix}
                  duration={2.4}
                  className="font-display leading-none tracking-[-0.04em]"
                  style={{
                    fontSize: 'clamp(56px,6vw,80px)',
                    fontWeight: 900,
                    color: 'var(--text-primary)',
                  }}
                />
                <span
                  className="font-body text-[13px] font-normal uppercase tracking-[0.08em]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {s.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
