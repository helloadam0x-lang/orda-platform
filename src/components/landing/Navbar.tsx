'use client'

import { useState, useEffect } from 'react'
import { OrdaLogo } from '@/components/shared/OrdaLogo'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 inset-x-0 z-50 h-[60px] flex items-center"
      style={{
        background: scrolled ? 'rgba(5,5,7,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(32px) saturate(160%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(32px) saturate(160%)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,0.05)' : 'transparent'}`,
        transition: 'background 400ms cubic-bezier(0.23,1,0.32,1), border-color 400ms cubic-bezier(0.23,1,0.32,1), backdrop-filter 400ms cubic-bezier(0.23,1,0.32,1)',
        animation: 'navFadeDown 0.5s cubic-bezier(0.23,1,0.32,1) 0.1s both',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
        <OrdaLogo size="md" />

        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'features', href: '#features' },
            { label: 'pricing', href: '#pricing' },
            { label: 'how it works', href: '#how-it-works' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: 400,
                textTransform: 'lowercase' as const,
                letterSpacing: '0.01em',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                transition: 'color 150ms cubic-bezier(0.23,1,0.32,1)',
              }}
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
            className="hidden sm:block"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              padding: '8px 16px',
              color: 'var(--text-muted)',
              textDecoration: 'none',
              transition: 'color 150ms cubic-bezier(0.23,1,0.32,1)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}
          >
            sign in
          </a>
          <a
            href="#"
            className="btn-primary px-5 py-2.5 text-[13px]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Start Free
          </a>
        </div>
      </div>
    </nav>
  )
}
