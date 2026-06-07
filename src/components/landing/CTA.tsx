'use client'

import Link from 'next/link'
import { Particles } from '@/components/ui/particles'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { BlurFade } from '@/components/ui/blur-fade'

export default function CTA() {
  return (
    <section style={{ position: 'relative', background: '#050505', padding: '160px 0', overflow: 'hidden', textAlign: 'center' }}>
      <Particles
        className='absolute inset-0'
        quantity={60}
        ease={80}
        color='#F59E0B'
        refresh
      />
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
        <BlurFade delay={0.1}>
          <h2 style={{
            fontFamily: 'var(--font-display, "Playfair Display", serif)',
            fontWeight: 900,
            fontSize: 'clamp(48px, 8vw, 100px)',
            lineHeight: 0.88,
            letterSpacing: '-0.04em',
            color: '#EFEFEF',
          }}>
            Your Business<br/>Never<br/>
            <span style={{ color: '#F59E0B' }}>Stops Working.</span>
          </h2>
        </BlurFade>

        <BlurFade delay={0.2}>
          <p style={{ marginTop: '28px', fontSize: '17px', color: 'rgba(239,239,239,0.4)', lineHeight: 1.65 }}>
            Join 500+ businesses already running on Orda.
          </p>
        </BlurFade>

        <BlurFade delay={0.3}>
          <div style={{ marginTop: '40px' }}>
            <Link href="/sign-up">
              <ShimmerButton
                shimmerColor='#F59E0B'
                background='rgba(245,158,11,0.12)'
                borderRadius='10px'
                className='px-10 py-4 text-base font-semibold text-[#F59E0B] border border-[rgba(245,158,11,0.35)] hover:border-[rgba(245,158,11,0.7)]'
              >
                Get Started Free — 7 Days →
              </ShimmerButton>
            </Link>
          </div>
          <p style={{ marginTop: '16px', fontSize: '12px', color: 'rgba(239,239,239,0.2)', letterSpacing: '0.04em' }}>
            No credit card · 5 minute setup · Cancel anytime
          </p>
        </BlurFade>
      </div>
    </section>
  )
}
