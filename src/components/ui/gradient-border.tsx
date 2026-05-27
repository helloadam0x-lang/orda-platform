'use client'

import { useRef, useEffect } from 'react'

interface GradientBorderProps {
  children: React.ReactNode
  active?: boolean
  speed?: number
  borderWidth?: number
  borderRadius?: number
  className?: string
}

export function GradientBorder({
  children,
  active = false,
  speed = 4,
  borderWidth = 1,
  borderRadius = 24,
  className = '',
}: GradientBorderProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const borderRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const angleRef = useRef(0)

  useEffect(() => {
    if (!active) return
    const el = borderRef.current
    if (!el) return

    const animate = () => {
      angleRef.current = (angleRef.current + speed * 0.5) % 360
      el.style.background = `conic-gradient(
        from ${angleRef.current}deg,
        transparent 0deg,
        rgba(212,168,83,0.0) 60deg,
        rgba(212,168,83,0.9) 120deg,
        rgba(255,220,140,1) 180deg,
        rgba(212,168,83,0.9) 240deg,
        rgba(212,168,83,0.0) 300deg,
        transparent 360deg
      )`
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active, speed])

  return (
    <div
      ref={wrapRef}
      className={`relative ${className}`}
      style={{ borderRadius, padding: active ? borderWidth : 0 }}
    >
      {/* Rotating gradient border */}
      {active && (
        <div
          ref={borderRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius,
            zIndex: 0,
          }}
        />
      )}

      {/* Static border fallback */}
      {!active && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius,
            border: `${borderWidth}px solid rgba(255,255,255,0.07)`,
          }}
        />
      )}

      {/* Inner content */}
      <div
        className="relative z-10 h-full"
        style={{
          borderRadius: active ? borderRadius - borderWidth : borderRadius,
          background: '#050507',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  )
}

/* ─── CSS-only shimmer border (lighter) ─── */
export function ShimmerBorder({
  children,
  className = '',
  borderRadius = 24,
}: {
  children: React.ReactNode
  className?: string
  borderRadius?: number
}) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        borderRadius,
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(212,168,83,0.35)',
        boxShadow: '0 0 40px rgba(212,168,83,0.08), inset 0 1px 0 rgba(212,168,83,0.15)',
      }}
    >
      {/* Top shimmer line */}
      <div
        className="absolute top-0 left-[10%] right-[10%] h-px pointer-events-none overflow-hidden"
        style={{ borderRadius: '0 0 2px 2px' }}
      >
        <div
          style={{
            height: '100%',
            background: 'linear-gradient(to right, transparent, rgba(212,168,83,0.8), transparent)',
            animation: 'shimmer-pass 2.5s cubic-bezier(0.23,1,0.32,1) infinite',
          }}
        />
      </div>
      {children}
    </div>
  )
}
