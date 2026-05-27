'use client'

import { useEffect, useRef } from 'react'

interface AuroraBackgroundProps {
  className?: string
  intensity?: 'subtle' | 'medium' | 'strong'
}

export function AuroraBackground({ className = '', intensity = 'medium' }: AuroraBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const intensityMap = { subtle: 0.04, medium: 0.07, strong: 0.12 }
    const alpha = intensityMap[intensity]

    let w = 0, h = 0
    const resize = () => {
      w = canvas.width = canvas.offsetWidth
      h = canvas.height = canvas.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    let t = 0
    const orbs = [
      { x: 0.3, y: 0.2, r: 0.55, hue: 38, sat: 70 },
      { x: 0.7, y: 0.8, r: 0.45, hue: 45, sat: 60 },
      { x: 0.8, y: 0.2, r: 0.4, hue: 32, sat: 50 },
      { x: 0.2, y: 0.7, r: 0.35, hue: 50, sat: 40 },
    ]

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      t += 0.003

      orbs.forEach((orb, i) => {
        const ox = (orb.x + Math.sin(t * 0.7 + i * 1.3) * 0.12) * w
        const oy = (orb.y + Math.cos(t * 0.5 + i * 0.9) * 0.1) * h
        const r = orb.r * Math.min(w, h)

        const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, r)
        grad.addColorStop(0, `hsla(${orb.hue + Math.sin(t + i) * 8}, ${orb.sat}%, 60%, ${alpha})`)
        grad.addColorStop(0.5, `hsla(${orb.hue + 10}, ${orb.sat - 10}%, 50%, ${alpha * 0.4})`)
        grad.addColorStop(1, 'transparent')

        ctx.fillStyle = grad
        ctx.fillRect(0, 0, w, h)
      })

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [intensity])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ mixBlendMode: 'screen' }}
    />
  )
}

/* ─── Static CSS-only version (lighter, SSR-safe fallback) ─── */
export function AuroraStaticBackground({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <div
        className="absolute rounded-full"
        style={{
          width: '80vmax', height: '80vmax',
          top: '-20%', left: '50%', transform: 'translateX(-50%)',
          background: 'radial-gradient(ellipse, rgba(212,168,83,0.07) 0%, rgba(212,168,83,0.02) 40%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'aurora-drift-1 16s ease-in-out infinite',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: '60vmax', height: '60vmax',
          bottom: '-15%', left: '-10%',
          background: 'radial-gradient(ellipse, rgba(255,220,120,0.05) 0%, transparent 65%)',
          filter: 'blur(100px)',
          animation: 'aurora-drift-2 20s ease-in-out infinite',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: '50vmax', height: '50vmax',
          top: '30%', right: '-10%',
          background: 'radial-gradient(ellipse, rgba(212,168,83,0.04) 0%, transparent 65%)',
          filter: 'blur(80px)',
          animation: 'aurora-drift-3 12s ease-in-out infinite',
        }}
      />
      {/* Horizontal streak */}
      <div
        className="absolute"
        style={{
          left: 0, right: 0, top: '35%', height: '1px',
          background: 'linear-gradient(to right, transparent 0%, rgba(212,168,83,0.08) 20%, rgba(212,168,83,0.18) 50%, rgba(212,168,83,0.08) 80%, transparent 100%)',
          filter: 'blur(4px)',
          animation: 'aurora-streak 18s ease-in-out infinite',
        }}
      />
    </div>
  )
}
