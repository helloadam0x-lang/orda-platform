'use client'

import { useRef, useEffect, useState } from 'react'

interface MarqueeProps {
  children: React.ReactNode
  speed?: number
  direction?: 'left' | 'right'
  pauseOnHover?: boolean
  gap?: number
  className?: string
}

export function Marquee({
  children,
  speed = 40,
  direction = 'left',
  pauseOnHover = true,
  gap = 0,
  className = '',
}: MarqueeProps) {
  const [duration, setDuration] = useState(speed)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!trackRef.current) return
    const el = trackRef.current.firstElementChild as HTMLElement
    if (!el) return
    const w = el.scrollWidth
    setDuration((w / 100) * (speed / 10))
  }, [speed])

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)' }}
    >
      <div
        ref={trackRef}
        className="flex w-max"
        style={{
          gap,
          animation: `marquee-scroll ${duration}s linear infinite ${direction === 'right' ? 'reverse' : 'normal'}`,
          animationPlayState: 'running',
        }}
        onMouseEnter={e => {
          if (pauseOnHover) {
            ;(e.currentTarget as HTMLDivElement).style.animationPlayState = 'paused'
          }
        }}
        onMouseLeave={e => {
          ;(e.currentTarget as HTMLDivElement).style.animationPlayState = 'running'
        }}
      >
        {/* Render children twice for seamless loop */}
        <div className="flex" style={{ gap }}>{children}</div>
        <div className="flex" aria-hidden="true" style={{ gap }}>{children}</div>
      </div>
    </div>
  )
}

/* ─── City ticker specifically ─── */
interface CityTickerProps {
  cities: string[]
  accent?: string
}

export function CityTicker({ cities, accent = 'rgba(212,168,83,0.4)' }: CityTickerProps) {
  return (
    <div
      className="relative py-3.5 overflow-hidden"
      style={{ borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}
    >
      <div
        className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, var(--bg-void), transparent)' }}
      />
      <div
        className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, var(--bg-void), transparent)' }}
      />
      <Marquee speed={50} pauseOnHover={false}>
        {cities.map((city, i) => (
          <span key={i} className="flex items-center gap-4 px-4">
            <span
              className="font-body text-[11px] font-medium uppercase tracking-[0.18em] whitespace-nowrap"
              style={{ color: 'rgba(239,239,239,0.2)' }}
            >
              {city}
            </span>
            <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: accent }} />
          </span>
        ))}
      </Marquee>
    </div>
  )
}
