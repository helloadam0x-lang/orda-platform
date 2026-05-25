'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function useCountUp(target: number, triggerRef: React.RefObject<HTMLElement>) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!triggerRef.current) return
    const st = ScrollTrigger.create({
      trigger: triggerRef.current,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const start = performance.now()
        const dur = 2400
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1)
          const ease = 1 - Math.pow(1 - p, 4)
          setVal(Math.round(ease * target))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
    })
    return () => st.kill()
  }, [target, triggerRef])
  return val
}

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const count = useCountUp(value, ref)
  const display = value >= 1_000_000
    ? `${Math.round(count / 1_000_000)}M`
    : count.toLocaleString()

  return (
    <div ref={ref} className="flex flex-col items-center gap-3 px-16 first:pl-0 last:pr-0">
      <span
        className="font-display tabular-nums leading-none tracking-[-0.04em]"
        style={{ fontSize: 'clamp(56px,6vw,80px)', fontWeight: 900, color: 'var(--text-primary)' }}
      >
        {display}{suffix}
      </span>
      <span
        className="font-body text-[13px] font-normal uppercase tracking-[0.08em]"
        style={{ color: 'var(--text-muted)' }}
      >
        {label}
      </span>
    </div>
  )
}

export default function Stats() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    gsap.fromTo(sectionRef.current,
      { opacity: 0, y: 30, scale: 0.97 },
      {
        opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'cubic-bezier(0.23,1,0.32,1)',
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
          {[
            { value: 2_000_000, suffix: '+', label: 'Messages Handled' },
            { value: 54, suffix: '', label: 'Countries' },
            { value: 500, suffix: '+', label: 'Businesses' },
          ].map((s, i) => (
            <div
              key={s.label}
              className="flex-1 flex justify-center"
              style={i > 0 ? { borderLeft: '1px solid var(--border-subtle)' } : {}}
            >
              <StatItem value={s.value} suffix={s.suffix} label={s.label} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
