'use client'

import { Globe } from '@/components/ui/globe'
import { BlurFade } from '@/components/ui/blur-fade'

export default function WhatsAppSection() {
  return (
    <section style={{ background: '#050507', padding: '120px 0', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>

          <BlurFade delay={0.1}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="16" fill="#25D366"/>
                  <path d="M23.5 8.5A10.44 10.44 0 0016 5.5C10.2 5.5 5.5 10.2 5.5 16a10.4 10.4 0 001.4 5.2L5.5 26.5l5.4-1.4A10.48 10.48 0 0016 26.5c5.8 0 10.5-4.7 10.5-10.5 0-2.8-1.1-5.4-3-7.5zM16 24.7a8.7 8.7 0 01-4.4-1.2l-.3-.2-3.2.8.9-3.1-.2-.3A8.6 8.6 0 1116 24.7zm4.8-6.5c-.3-.1-1.6-.8-1.8-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1a7.26 7.26 0 01-2.1-1.3 7.9 7.9 0 01-1.5-1.8c-.1-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.3-.1-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.7 1.1 2.9c.1.2 2 3 4.8 4.2.7.3 1.2.4 1.6.5.7.2 1.3.2 1.8.1.5-.1 1.6-.7 1.9-1.3.2-.6.2-1.2.1-1.3-.1-.1-.3-.2-.6-.3z" fill="white"/>
                </svg>
                <span style={{
                  fontSize: '11px', letterSpacing: '0.14em',
                  textTransform: 'uppercase', color: 'rgba(239,239,239,0.3)',
                }}>
                  The world runs on WhatsApp
                </span>
              </div>

              <h2 style={{
                fontFamily: 'var(--font-display, "Playfair Display", serif)',
                fontWeight: 900,
                fontSize: 'clamp(40px, 5vw, 72px)',
                lineHeight: 0.92,
                letterSpacing: '-0.03em',
                color: '#EFEFEF',
              }}>
                2 billion<br/>people.<br/>
                <span style={{
                  background: 'linear-gradient(135deg, #D4A853, #F5D78E)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>One chat.</span>
              </h2>

              <p style={{
                marginTop: '28px', fontSize: '16px', lineHeight: 1.7,
                color: 'rgba(239,239,239,0.45)', maxWidth: '460px',
                fontFamily: 'var(--font-body)',
              }}>
                Orda connects directly to your WhatsApp Business number.
                Every message answered. Every order captured.
                Every payment collected. Inside the app your customers already use every day.
              </p>

              <div style={{ display: 'flex', gap: '10px', marginTop: '36px', flexWrap: 'wrap' }}>
                {['Replies in 0.9s', 'Voice messages', 'Payments inside chat'].map(f => (
                  <span key={f} style={{
                    padding: '7px 16px',
                    border: '1px solid rgba(212,168,83,0.25)',
                    borderRadius: '100px',
                    fontSize: '12px',
                    color: '#D4A853',
                    background: 'rgba(212,168,83,0.05)',
                  }}>{f}</span>
                ))}
              </div>
            </div>
          </BlurFade>

          {/* Globe */}
          <BlurFade delay={0.3}>
            <div style={{ position: 'relative', height: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe className='w-full h-full' />
              <div style={{
                position: 'absolute', bottom: '40px', left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(255,255,255,0.025)',
                backdropFilter: 'blur(40px)',
                border: '1px solid rgba(212,168,83,0.2)',
                borderRadius: '100px',
                padding: '8px 20px',
                fontSize: '12px',
                color: '#D4A853',
                whiteSpace: 'nowrap',
              }}>
                Active in 54 countries
              </div>
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  )
}
