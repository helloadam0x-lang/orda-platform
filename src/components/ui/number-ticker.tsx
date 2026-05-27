'use client'

import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { gsap } from 'gsap'

gsap.registerPlugin(ScrollTrigger)

interface NumberTickerProps {
  value: number
  suffix?: string
  duration?: number
  className?: string
  style?: React.CSSProperties
}

export function NumberTicker({
  value,
  suffix = '',
  duration = 2.2,
  className = '',
  style,
}: NumberTickerProps) {
  const [current, setCurrent] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        const start = performance.now()
        const dur = duration * 1000
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1)
          const ease = 1 - Math.pow(1 - p, 4)
          setCurrent(Math.round(ease * value))
          if (p < 1) requestAnimationFrame(tick)
          else setCurrent(value)
        }
        requestAnimationFrame(tick)
      },
    })
    return () => st.kill()
  }, [value, duration])

  const display =
    value >= 1_000_000
      ? `${Math.round(current / 1_000_000)}M`
      : value >= 1_000
      ? current.toLocaleString()
      : String(current)

  return (
    <span ref={ref} className={`tabular-nums ${className}`} style={style}>
      {display}{suffix}
    </span>
  )
}
