'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { countUp } from '@/lib/gsap-animations'

gsap.registerPlugin(ScrollTrigger)

function StatItem({ num, suffix, label }: { num: number; suffix: string; label: string }) {
  const [val, setVal] = useState(0)
  const spanRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!spanRef.current) return
    countUp(num, setVal, spanRef.current)
  }, [num])

  return (
    <div className="flex flex-col items-center gap-2 text-center px-10 first:pl-0 last:pr-0">
      <span ref={spanRef} className="text-[clamp(56px,8vw,100px)] font-black text-white leading-none tracking-tight tabular-nums">
        {val.toLocaleString()}{suffix}
      </span>
      <span className="text-[12px] text-white/35 tracking-[0.18em] uppercase font-medium">{label}</span>
    </div>
  )
}

export default function Stats() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    gsap.fromTo(sectionRef.current, { opacity: 0, y: 50 }, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' }
    })
  }, [])

  return (
    <section ref={sectionRef} className="py-20" style={{ opacity: 0 }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="glass glow-card rounded-3xl py-14 px-8 flex flex-col md:flex-row items-center justify-center
          gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
          <StatItem num={2000000} suffix="+" label="Messages Handled" />
          <StatItem num={54} suffix="" label="Countries Active" />
          <StatItem num={500} suffix="+" label="Businesses Running" />
        </div>
      </div>
    </section>
  )
}
