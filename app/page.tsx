'use client'

import { useEffect } from 'react'
import Navbar from '@/components/sections/Navbar'
import Hero from '@/components/sections/Hero'
import Ticker from '@/components/sections/Ticker'
import Stats from '@/components/sections/Stats'
import Platforms from '@/components/sections/Platforms'
import HowItWorks from '@/components/sections/HowItWorks'
import Features from '@/components/sections/Features'
import Pricing from '@/components/sections/Pricing'
import Testimonials from '@/components/sections/Testimonials'
import FinalCTA from '@/components/sections/FinalCTA'
import Footer from '@/components/sections/Footer'
import { useLenis } from '@/lib/lenis'

export default function Home() {
  useLenis()

  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <Hero />
      <Ticker />
      <Stats />
      <Platforms />
      <HowItWorks />
      <Features />
      <Pricing />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </main>
  )
}
