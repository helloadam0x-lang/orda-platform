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
import { CityTicker } from '@/components/ui/animated-marquee'
import { useSmoothScroll } from '@/lib/smooth-scroll'

const CustomCursor = dynamic(() => import('@/components/ui/CustomCursor'), { ssr: false })

const cities = [
  'New York', 'London', 'Dubai', 'Tokyo', 'Paris',
  'Toronto', 'Sydney', 'Singapore', 'Berlin', 'Mumbai', 'São Paulo', 'Seoul',
]

export default function Home() {
  useSmoothScroll()

  return (
    <main className="relative min-h-screen" style={{ background: 'var(--bg-void)' }}>
      <CustomCursor />
      <Navbar />
      <Hero />
      <CityTicker cities={cities} />
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
