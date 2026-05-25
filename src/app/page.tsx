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

const cities = [
  'New York', 'London', 'Dubai', 'Tokyo', 'Lagos',
  'Paris', 'Toronto', 'Sydney', 'Singapore', 'Nairobi', 'Berlin', 'Mumbai',
]
const tickerItems = [...cities, ...cities]

function Ticker() {
  return (
    <div
      className="relative py-3.5 overflow-hidden"
      style={{ borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}
    >
      <div
        className="absolute inset-y-0 left-0 w-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, var(--bg-void), transparent)' }}
      />
      <div
        className="absolute inset-y-0 right-0 w-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, var(--bg-void), transparent)' }}
      />
      <div
        className="flex gap-0 whitespace-nowrap"
        style={{ animation: 'ticker 30s linear infinite' }}
      >
        {tickerItems.map((city, i) => (
          <span key={i} className="flex items-center gap-4 px-4">
            <span
              className="font-body text-[11px] font-medium uppercase tracking-[0.18em]"
              style={{ color: 'rgba(239,239,239,0.2)' }}
            >
              {city}
            </span>
            <span
              className="w-1 h-1 rounded-full flex-shrink-0"
              style={{ background: 'rgba(212,168,83,0.4)' }}
            />
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  useSmoothScroll()

  return (
    <main className="relative min-h-screen" style={{ background: 'var(--bg-void)' }}>
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
