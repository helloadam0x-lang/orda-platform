'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export interface BentoItem {
  title: string
  body: string
  icon: React.ReactNode
  colSpan?: 1 | 2
  rowSpan?: 1 | 2
  accent?: boolean
  feature?: React.ReactNode
}

interface BentoGridProps {
  items: BentoItem[]
  className?: string
}

function BentoCard({ item, index }: { item: BentoItem; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const shimmerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    el.style.setProperty('--mouse-x', `${x}%`)
    el.style.setProperty('--mouse-y', `${y}%`)
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="relative rounded-2xl overflow-hidden group bento-card"
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(60px) saturate(200%)',
        WebkitBackdropFilter: 'blur(60px) saturate(200%)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07), 0 40px 80px rgba(0,0,0,0.4)',
        opacity: 0,
        transition: [
          'border-color 250ms cubic-bezier(0.23,1,0.32,1)',
          'box-shadow 250ms cubic-bezier(0.23,1,0.32,1)',
          'transform 250ms cubic-bezier(0.23,1,0.32,1)',
        ].join(', '),
        gridColumn: item.colSpan === 2 ? 'span 2' : 'span 1',
        gridRow: item.rowSpan === 2 ? 'span 2' : 'span 1',
        minHeight: item.rowSpan === 2 ? '320px' : '160px',
      }}
    >
      {/* Mouse-follow spotlight */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
        style={{
          background: 'radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(212,168,83,0.06) 0%, transparent 70%)',
          transition: 'opacity 300ms cubic-bezier(0.23,1,0.32,1)',
        }}
      />

      {/* Shimmer on hover */}
      <div
        ref={shimmerRef}
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%)',
          animation: 'shimmer-pass 1.4s cubic-bezier(0.23,1,0.32,1) infinite',
          transition: 'opacity 200ms cubic-bezier(0.23,1,0.32,1)',
        }}
      />

      <div className="relative z-10 p-7 h-full flex flex-col">
        {/* Accent bar */}
        <div
          className="w-8 h-px mb-6 flex-shrink-0"
          style={{ background: item.accent ? 'var(--accent)' : 'rgba(255,255,255,0.15)' }}
        />

        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 flex-shrink-0"
          style={{
            background: item.accent ? 'rgba(212,168,83,0.1)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${item.accent ? 'rgba(212,168,83,0.2)' : 'rgba(255,255,255,0.07)'}`,
            color: item.accent ? 'var(--accent)' : 'var(--text-secondary)',
            transition: 'color 200ms cubic-bezier(0.23,1,0.32,1), background 200ms cubic-bezier(0.23,1,0.32,1)',
          }}
        >
          {item.icon}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3
              className="font-display font-bold text-[15px] mb-2 leading-snug"
              style={{ color: 'var(--text-primary)' }}
            >
              {item.title}
            </h3>
            <p
              className="font-body text-[13px] leading-relaxed"
              style={{ color: 'var(--text-muted)' }}
            >
              {item.body}
            </p>
          </div>
          {item.feature && (
            <div className="mt-6">{item.feature}</div>
          )}
        </div>
      </div>

      {/* Hover border glow */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100"
        style={{
          border: '1px solid rgba(212,168,83,0.18)',
          transition: 'opacity 250ms cubic-bezier(0.23,1,0.32,1)',
        }}
      />
    </div>
  )
}

export function BentoGrid({ items, className = '' }: BentoGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!gridRef.current) return
    const cards = Array.from(gridRef.current.querySelectorAll('.bento-card'))
    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 40, scale: 0.96 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.6,
          ease: 'cubic-bezier(0.23,1,0.32,1)',
          delay: i * 0.05,
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 78%',
          },
        }
      )
    })
  }, [])

  return (
    <div
      ref={gridRef}
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 ${className}`}
    >
      {items.map((item, i) => (
        <BentoCard key={item.title} item={item} index={i} />
      ))}
    </div>
  )
}
