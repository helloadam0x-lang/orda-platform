'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useMagneticCursor } from '@/hooks/useMagneticCursor'

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const ctaRef = useMagneticCursor<HTMLAnchorElement>(0.35)

  useEffect(() => {
    gsap.fromTo(navRef.current, { opacity: 0, y: -24 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.1 })
  }, [])

  return (
    <nav ref={navRef} className="glass-nav fixed top-0 inset-x-0 z-50 px-6 py-4" style={{ opacity: 0 }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative w-7 h-7 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#8729A0] opacity-25 blur-lg" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#C084FC] relative z-10" />
          </div>
          <span className="text-[15px] font-black tracking-[0.2em] text-white">ORDA</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Pricing', 'How It Works', 'Testimonials'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s+/g,'-')}`}
              className="text-[13px] text-white/40 hover:text-white/80 transition-colors duration-200 tracking-wide">
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a href="#" className="text-[13px] text-white/40 hover:text-white/70 transition-colors px-4 py-2 hidden sm:block">
            Sign In
          </a>
          <a ref={ctaRef} href="#"
            className="btn-cta px-5 py-2.5 rounded-full text-[13px] font-semibold text-white tracking-wide">
            Start Free
          </a>
        </div>
      </div>
    </nav>
  )
}
