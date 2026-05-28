'use client'

import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'
import { BlurFade } from '@/components/ui/blur-fade'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { DotPattern } from '@/components/ui/dot-pattern'
import { MagicCard } from '@/components/ui/magic-card'
import { BorderBeam } from '@/components/ui/border-beam'
import { cn } from '@/lib/utils'
import { ArrowRight, Zap } from 'lucide-react'

const messages = [
  { role: 'customer', text: 'Hi, is the black jacket still available?' },
  { role: 'orda', text: 'Yes, we have 3 left in stock. Want me to reserve one?' },
  { role: 'customer', text: 'Yes please!' },
  { role: 'orda', text: 'Reserved ✓ Payment link sent to your number.' },
]

export default function Hero() {
  return (
    <section className='relative min-h-screen flex items-center overflow-hidden' style={{ background: '#050507' }}>

      {/* Atmospheric orbs */}
      <div className='absolute inset-0 pointer-events-none overflow-hidden'>
        <div style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(212,168,83,0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'orb-breathe 8s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(212,168,83,0.07) 0%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'orb-breathe 10s ease-in-out 3s infinite',
        }} />
        <div style={{
          position: 'absolute',
          top: '40%',
          right: '15%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(37,211,102,0.05) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'orb-breathe 12s ease-in-out 6s infinite',
        }} />
      </div>

      {/* Dot pattern background */}
      <DotPattern
        className={cn(
          'absolute inset-0 opacity-15',
          '[mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_70%)]'
        )}
        style={{ color: 'rgba(212,168,83,0.4)' }}
      />

      <div className='relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>

        {/* Left content */}
        <div>
          <BlurFade delay={0.1}>
            <AnimatedGradientText className='mb-6 inline-flex'>
              <Zap size={12} className='mr-1.5' style={{ color: '#D4A853' }} />
              <span className={cn(
                'text-xs font-medium tracking-widest uppercase',
                'bg-[linear-gradient(90deg,#D4A853,#F5D78E,#D4A853)] bg-clip-text text-transparent'
              )}>
                Now live in 54 countries
              </span>
            </AnimatedGradientText>
          </BlurFade>

          <BlurFade delay={0.2}>
            <h1 style={{
              fontFamily: 'var(--font-display, "Playfair Display", serif)',
              fontWeight: 900,
              fontSize: 'clamp(56px, 8vw, 104px)',
              lineHeight: 0.88,
              letterSpacing: '-0.04em',
              color: '#EFEFEF',
            }}>
              Every<br />Customer.<br />
              <span style={{
                background: 'linear-gradient(135deg, #D4A853 0%, #F5D78E 50%, #D4A853 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Always<br />Answered.
              </span>
            </h1>
          </BlurFade>

          <BlurFade delay={0.35}>
            <p style={{
              marginTop: '32px',
              fontSize: '17px',
              lineHeight: 1.7,
              color: 'rgba(239,239,239,0.5)',
              maxWidth: '480px',
              fontFamily: 'var(--font-body)',
            }}>
              Connect your WhatsApp. Get an AI agent that handles every customer message,
              takes orders, runs your store, and sends real notifications — automatically.
            </p>
          </BlurFade>

          <BlurFade delay={0.45}>
            <div style={{ display: 'flex', gap: '12px', marginTop: '40px', flexWrap: 'wrap', alignItems: 'center' }}>
              <ShimmerButton
                shimmerColor='#D4A853'
                background='rgba(212,168,83,0.12)'
                borderRadius='8px'
                className='px-7 py-3 text-sm font-semibold text-[#D4A853] border border-[rgba(212,168,83,0.3)] hover:border-[rgba(212,168,83,0.6)]'
              >
                Start Free — 7 Days
              </ShimmerButton>
              <a href='#how-it-works' style={{
                padding: '12px 24px',
                background: 'transparent',
                border: '1px solid rgba(239,239,239,0.1)',
                borderRadius: '8px',
                color: 'rgba(239,239,239,0.6)',
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: 'var(--font-body)',
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'border-color 200ms cubic-bezier(0.23,1,0.32,1), color 200ms cubic-bezier(0.23,1,0.32,1)',
              }}>
                See It Work <ArrowRight size={14} />
              </a>
            </div>
          </BlurFade>

          <BlurFade delay={0.5}>
            <p style={{
              marginTop: '20px',
              fontSize: '12px',
              color: 'rgba(239,239,239,0.25)',
              letterSpacing: '0.02em',
              fontFamily: 'var(--font-body)',
            }}>
              No credit card · 5 minute setup · Cancel anytime
            </p>
          </BlurFade>
        </div>

        {/* Right — Chat card */}
        <BlurFade delay={0.6} className='relative'>
          <div style={{ animation: 'heroFloat 6s ease-in-out infinite' }}>
            <MagicCard
              className='relative w-full max-w-sm mx-auto rounded-2xl overflow-hidden bg-[rgba(255,255,255,0.025)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_40px_80px_rgba(0,0,0,0.6)]'
              gradientColor='rgba(212,168,83,0.08)'
            >
              <BorderBeam
                size={300}
                duration={8}
                colorFrom='#D4A853'
                colorTo='transparent'
              />
              {/* Chat header */}
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #25D366, #128C7E)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', fontWeight: 800, color: 'white',
                  fontFamily: 'var(--font-display)',
                }}>O</div>
                <div>
                  <div style={{ color: '#EFEFEF', fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-body)' }}>Orda Business</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: '#25D366',
                      animation: 'statusPulse 2s ease-in-out infinite',
                    }}/>
                    <span style={{ color: '#25D366', fontSize: '10px', fontFamily: 'var(--font-body)' }}>Online · 0.9s avg reply</span>
                  </div>
                </div>
              </div>
              {/* Messages */}
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      alignSelf: msg.role === 'orda' ? 'flex-end' : 'flex-start',
                      maxWidth: '82%',
                      animation: `msgFadeIn 0.4s cubic-bezier(0.23,1,0.32,1) ${0.8 + i * 0.3}s both`,
                    }}
                  >
                    <div style={{
                      padding: '9px 13px',
                      borderRadius: msg.role === 'orda' ? '14px 14px 3px 14px' : '14px 14px 14px 3px',
                      background: msg.role === 'orda'
                        ? 'linear-gradient(135deg, rgba(212,168,83,0.25), rgba(212,168,83,0.12))'
                        : 'rgba(255,255,255,0.06)',
                      border: msg.role === 'orda'
                        ? '1px solid rgba(212,168,83,0.3)'
                        : '1px solid rgba(255,255,255,0.07)',
                      color: '#EFEFEF',
                      fontSize: '12px',
                      lineHeight: 1.5,
                      fontFamily: 'var(--font-body)',
                    }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {/* Typing indicator */}
                <div style={{ alignSelf: 'flex-start', animation: 'msgFadeIn 0.4s cubic-bezier(0.23,1,0.32,1) 2.2s both' }}>
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: '14px 14px 14px 3px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    display: 'flex', gap: '4px', alignItems: 'center',
                  }}>
                    {[0, 1, 2].map(j => (
                      <div key={j} style={{
                        width: 5, height: 5, borderRadius: '50%',
                        background: '#D4A853',
                        animation: `typingBounce 0.9s ease-in-out ${j * 0.15}s infinite`,
                      }} />
                    ))}
                  </div>
                </div>
              </div>
              {/* Footer badge */}
              <div style={{
                padding: '10px 20px',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span style={{
                  fontSize: '10px',
                  color: 'rgba(239,239,239,0.25)',
                  letterSpacing: '0.06em',
                  fontFamily: 'var(--font-body)',
                }}>
                  POWERED BY ORDA AI
                </span>
                <span style={{
                  fontSize: '10px', color: '#25D366',
                  display: 'flex', alignItems: 'center', gap: '4px',
                  fontFamily: 'var(--font-body)',
                }}>
                  <span style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: '#25D366',
                    display: 'inline-block',
                    animation: 'statusPulse 2s ease-in-out infinite',
                  }} />
                  Live
                </span>
              </div>
            </MagicCard>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
