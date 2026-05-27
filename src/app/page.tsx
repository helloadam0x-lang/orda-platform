'use client'

import dynamic from 'next/dynamic'
import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import CityTicker from '@/components/landing/CityTicker'
import Stats from '@/components/landing/Stats'
import WhatsAppSection from '@/components/landing/WhatsAppSection'
import Story from '@/components/landing/Story'
import Features from '@/components/landing/Features'
import Pricing from '@/components/landing/Pricing'
import Testimonials from '@/components/landing/Testimonials'
import CTA from '@/components/landing/CTA'
import Footer from '@/components/landing/Footer'

const CustomCursor = dynamic(() => import('@/components/ui/CustomCursor'), { ssr: false })

export default function Home() {
  return (
    <main style={{ background: '#050507', minHeight: '100vh' }}>
      <CustomCursor />
      <Navbar />
      <Hero />
      <CityTicker />
      <Stats />
      <WhatsAppSection />
      <Story />
      <Features />
      <Pricing />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  )
}
