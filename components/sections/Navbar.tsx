'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { motion } from 'framer-motion'

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!navRef.current) return
    gsap.fromTo(
      navRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.1 }
    )
  }, [])

  return (
    <nav
      ref={navRef}
      className="glass-nav fixed top-0 left-0 right-0 z-50 px-6 py-4"
      style={{ opacity: 0 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-accent opacity-20 blur-md" />
            <div className="w-2.5 h-2.5 rounded-full bg-accent-light relative z-10" />
          </div>
          <span className="text-lg font-bold tracking-widest text-text-primary">ORDA</span>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Pricing', 'How It Works', 'Testimonials'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm text-text-muted hover:text-text-primary transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="hidden sm:block text-sm text-text-muted hover:text-text-primary transition-colors duration-200 px-4 py-2"
          >
            Sign In
          </a>
          <a
            href="#"
            className="btn-primary px-5 py-2.5 rounded-full text-sm font-semibold text-white"
          >
            Start Free
          </a>
        </div>
      </div>
    </nav>
  )
}
