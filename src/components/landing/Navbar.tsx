'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useMagneticCursor } from '@/hooks/useMagneticCursor'

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const ctaRef = useMagneticCursor<HTMLAnchorElement>(0.2)

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'cubic-bezier(0.23,1,0.32,1)', delay: 0.3 }
    )
  }, [])

  return (
    <nav
      ref={navRef}
      className="glass-nav fixed top-0 inset-x-0 z-50 h-[60px] flex items-center"
      style={{ opacity: 0 }}
    >
      <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
        <span
          className="font-display text-[16px] font-bold tracking-[0.1em] uppercase"
          style={{ color: 'var(--text-primary)' }}
        >
          ORDA
        </span>

        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'features', href: '#features' },
            { label: 'pricing', href: '#pricing' },
            { label: 'how it works', href: '#how-it-works' },
            { label: 'testimonials', href: '#testimonials' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="font-body text-[13px] font-normal lowercase tracking-[0.01em] transition-colors duration-[150ms]"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#"
            className="hidden sm:block font-body text-[13px] px-4 py-2 transition-colors duration-[150ms]"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}
          >
            sign in
          </a>
          <a ref={ctaRef} href="#" className="btn-primary px-5 py-2.5 text-[13px]">
            Start Free
          </a>
        </div>
      </div>
    </nav>
  )
}
