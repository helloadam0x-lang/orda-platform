'use client'

import dynamic from 'next/dynamic'
import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import Stats from '@/components/landing/Stats'
import Platforms from '@/components/landing/Platforms'
import Story from '@/components/landing/Story'
import Features from '@/components/landing/Features'
import Pricing from '@/components/landing/Pricing'
import Testimonials from '@/components/landing/Testimonials'
import CTA from '@/components/landing/CTA'
import Footer from '@/components/landing/Footer'
import { useSmoothScroll } from '@/lib/smooth-scroll'

const CustomCursor = dynamic(() => import('@/components/ui/CustomCursor'), { ssr: false })

const cities = ['New York', 'London', 'Dubai', 'Tokyo', 'Lagos', 'Paris', 'Toronto', 'Sydney', 'Singapore', 'Nairobi', 'Berlin', 'Mumbai']
const ticker = [...cities, ...cities]

function Ticker() {
  return (
    <div className="relative py-4 overflow-hidden border-y border-white/[0.05]">
      <div className="absolute inset-y-0 left-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #08080C, transparent)' }} />
      <div className="absolute inset-y-0 right-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #08080C, transparent)' }} />
      <div className="flex gap-0 whitespace-nowrap" style={{ animation: 'ticker 28s linear infinite' }}>
        {ticker.map((city, i) => (
          <span key={i} className="flex items-center gap-4 px-4">
            <span className="text-[11px] font-medium text-white/25 tracking-[0.18em] uppercase">{city}</span>
            <span className="w-1 h-1 rounded-full bg-[#8729A0]/50 flex-shrink-0" />
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  useSmoothScroll()

  return (
    <main className="relative min-h-screen" style={{ background: '#08080C' }}>
      <CustomCursor />
      <Navbar />
      <Hero />
      <Ticker />
      <Stats />
      <Platforms />
      <Story />
      <Features />
      <Pricing />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  )
}
