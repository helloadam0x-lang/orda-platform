'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function useCountUp(target: number, suffix: string, duration = 2) {
  const [displayValue, setDisplayValue] = useState('0' + suffix)
  const elRef = useRef<HTMLSpanElement>(null)
  const triggered = useRef(false)

  useEffect(() => {
    if (!elRef.current) return
    const trigger = ScrollTrigger.create({
      trigger: elRef.current,
      start: 'top 85%',
      onEnter: () => {
        if (triggered.current) return
        triggered.current = true
        const obj = { val: 0 }
        gsap.to(obj, {
          val: target,
          duration,
          ease: 'power2.out',
          onUpdate: () => {
            const rounded = Math.round(obj.val)
            setDisplayValue(rounded.toLocaleString() + suffix)
          },
          onComplete: () => {
            setDisplayValue(target.toLocaleString() + suffix)
          },
        })
      },
    })
    return () => trigger.kill()
  }, [target, duration, suffix])

  return { displayValue, ref: elRef }
}

function StatItem({ num, suffix, label }: { num: number; suffix: string; label: string }) {
  const { displayValue, ref } = useCountUp(num, suffix, 2.2)
  return (
    <div className="flex flex-col items-center gap-3 text-center px-8 first:pl-0 last:pr-0">
      <span
        ref={ref}
        className="text-6xl sm:text-7xl lg:text-8xl font-black text-text-primary leading-none tracking-tight"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {displayValue}
      </span>
      <span className="text-base text-text-muted tracking-widest uppercase font-medium">{label}</span>
    </div>
  )
}

export default function Stats() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 60 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
      }
    )
  }, [])

  return (
    <section ref={sectionRef} className="py-24 relative" style={{ opacity: 0 }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="glass-card rounded-3xl p-12 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-white/[0.08]">
          <StatItem num={2000000} suffix="+" label="Messages Handled" />
          <StatItem num={54} suffix="" label="Countries Active" />
          <StatItem num={500} suffix="+" label="Businesses Running" />
        </div>
      </div>
    </section>
  )
}
