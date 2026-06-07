'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { DotPattern } from '@/components/ui/dot-pattern'
import { MagicCard } from '@/components/ui/magic-card'
import { BorderBeam } from '@/components/ui/border-beam'
import { cn } from '@/lib/utils'

const SPRING = { type: 'spring' as const, stiffness: 400, damping: 25 }

const messages = [
  { role: 'customer', text: 'Is the black jacket still available?' },
  { role: 'orda',     text: 'Yes — 3 left. Reserving one now.' },
  { role: 'customer', text: 'Perfect, I\'ll take it.' },
  { role: 'orda',     text: 'Reserved ✓  Payment link sent.' },
]

const stats = [
  { val: '2.4M+', label: 'Messages Handled', green: true },
  { val: '54',    label: 'Countries',         green: false },
  { val: '500+',  label: 'Businesses',        green: false },
]

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: '#050505' }}>

      {/* Atmospheric orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div style={{
          position: 'absolute', top: '-20%', left: '-10%',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(245,158,11,0.08) 0%, transparent 70%)',
          filter: 'blur(80px)', animation: 'orb-breathe 8s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', right: '-5%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(0,255,102,0.04) 0%, transparent 70%)',
          filter: 'blur(100px)', animation: 'orb-breathe 10s ease-in-out 3s infinite',
        }} />
      </div>

      <DotPattern
        className={cn(
          'absolute inset-0 opacity-10',
          '[mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_70%)]'
        )}
        style={{ color: 'rgba(245,158,11,0.3)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left */}
        <div>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 12px 4px 8px',
              border: '1px solid rgba(0,255,102,0.2)',
              borderRadius: 100,
              background: 'rgba(0,255,102,0.04)',
              marginBottom: 24,
            }}
          >
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#00FF66',
              boxShadow: '0 0 6px #00FF66',
              animation: 'statusPulse 2s ease-in-out infinite',
              display: 'inline-block',
            }} />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11, letterSpacing: '0.08em',
              color: '#00FF66',
            }}>
              LIVE · 54 COUNTRIES
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.05 }}
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: 900,
              fontSize: 'clamp(52px, 7.5vw, 100px)',
              lineHeight: 0.88,
              letterSpacing: '-0.04em',
              color: '#F5F5F5',
            }}
          >
            Every<br />Customer.<br />
            <span style={{ color: '#F59E0B' }}>Always<br />Answered.</span>
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.1 }}
            style={{
              marginTop: 28, fontSize: 16, lineHeight: 1.75,
              color: 'rgba(245,245,245,0.5)',
              maxWidth: 460,
              fontFamily: 'var(--font-body)',
            }}
          >
            Connect your WhatsApp. Get an AI agent that handles every message,
            takes orders, and collects payments — automatically.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.15 }}
            style={{ display: 'flex', gap: 12, marginTop: 36, flexWrap: 'wrap', alignItems: 'center' }}
          >
            <Link href="/sign-up">
              <motion.button
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: '13px 28px',
                  background: '#F59E0B',
                  border: 'none',
                  borderRadius: 8,
                  color: '#050505',
                  fontSize: 14, fontWeight: 700,
                  fontFamily: 'var(--font-body)',
                  cursor: 'pointer',
                  boxShadow: '0 0 0 0 rgba(245,158,11,0)',
                  transition: 'box-shadow 150ms ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'inset 0 -2px 6px rgba(0,0,0,0.2)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 0 rgba(245,158,11,0)' }}
              >
                Start Free — 7 Days
              </motion.button>
            </Link>
            <a
              href="#how-it-works"
              style={{
                padding: '13px 24px',
                background: 'transparent',
                border: '1px solid rgba(245,245,245,0.1)',
                borderRadius: 8,
                color: 'rgba(245,245,245,0.55)',
                fontSize: 14, fontWeight: 500,
                fontFamily: 'var(--font-body)',
                cursor: 'pointer', textDecoration: 'none',
                transition: 'border-color 150ms ease, color 150ms ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,245,245,0.25)'
                ;(e.currentTarget as HTMLElement).style.color = 'rgba(245,245,245,0.8)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,245,245,0.1)'
                ;(e.currentTarget as HTMLElement).style.color = 'rgba(245,245,245,0.55)'
              }}
            >
              See It Work →
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...SPRING, delay: 0.2 }}
            style={{
              marginTop: 16, fontSize: 11,
              color: 'rgba(245,245,245,0.2)',
              letterSpacing: '0.04em',
              fontFamily: 'var(--font-mono)',
            }}
          >
            NO_CREDIT_CARD · 5_MIN_SETUP · CANCEL_ANYTIME
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.25 }}
            style={{
              display: 'flex', gap: 32, marginTop: 40,
              paddingTop: 32,
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {stats.map(s => (
              <div key={s.val}>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  fontSize: 'clamp(22px, 3vw, 30px)',
                  letterSpacing: '-0.02em',
                  color: s.green ? '#00FF66' : '#F5F5F5',
                  lineHeight: 1,
                }}>
                  {s.val}
                </div>
                <div style={{
                  marginTop: 4, fontSize: 11,
                  color: 'rgba(245,245,245,0.35)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-body)',
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — Developer log chat card */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...SPRING, delay: 0.2 }}
          style={{ animation: 'heroFloat 6s ease-in-out infinite' }}
        >
          <MagicCard
            className="relative w-full max-w-sm mx-auto rounded-2xl overflow-hidden bg-black border border-white/[0.07]"
            gradientColor="rgba(245,158,11,0.05)"
          >
            <BorderBeam size={300} duration={8} colorFrom="#F59E0B" colorTo="transparent" />

            {/* Terminal header */}
            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(255,255,255,0.02)',
            }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {['#FF5F57','#FEBC2E','#28C840'].map((c, i) => (
                  <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.7 }} />
                ))}
              </div>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 11,
                color: 'rgba(245,245,245,0.3)', letterSpacing: '0.06em',
                marginLeft: 4,
              }}>
                orda_agent · session_4821
              </span>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#00FF66',
                  boxShadow: '0 0 6px #00FF66',
                  animation: 'statusPulse 2s ease-in-out infinite',
                  display: 'inline-block',
                }} />
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10,
                  color: '#00FF66', letterSpacing: '0.06em',
                }}>LIVE</span>
              </div>
            </div>

            {/* Messages */}
            <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* Timestamp */}
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 9,
                color: 'rgba(245,245,245,0.2)', letterSpacing: '0.06em',
                textAlign: 'center', marginBottom: 4,
              }}>
                [14:32:07.003] SESSION_START
              </div>

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.35, duration: 0.3 }}
                  style={{ alignSelf: msg.role === 'orda' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}
                >
                  <div style={{
                    padding: '8px 12px',
                    borderRadius: msg.role === 'orda' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                    background: msg.role === 'orda'
                      ? 'rgba(245,158,11,0.08)'
                      : 'rgba(255,255,255,0.04)',
                    border: msg.role === 'orda'
                      ? '1px solid rgba(245,158,11,0.2)'
                      : '1px solid rgba(255,255,255,0.06)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    lineHeight: 1.5,
                    color: msg.role === 'orda' ? 'rgba(245,245,245,0.85)' : 'rgba(245,245,245,0.6)',
                  }}>
                    {msg.text}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 9,
                    color: 'rgba(245,245,245,0.18)',
                    marginTop: 3, letterSpacing: '0.04em',
                    textAlign: msg.role === 'orda' ? 'right' : 'left',
                  }}>
                    {msg.role === 'orda' ? 'ORDA_AI' : 'CUSTOMER'} · {['14:32:08','14:32:09','14:32:14','14:32:15'][i]}
                  </div>
                </motion.div>
              ))}

              {/* Payment confirmation */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.4, duration: 0.3 }}
                style={{
                  marginTop: 6,
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: '1px solid #00FF66',
                  background: 'rgba(0,255,102,0.04)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: '#00FF66',
                  letterSpacing: '0.04em',
                  lineHeight: 1.6,
                }}
              >
                PAID ✓ $89.00 · #ORD-20260601-4821 · 0.3s
              </motion.div>

              {/* Typing */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.8 }}
                style={{ alignSelf: 'flex-start' }}
              >
                <div style={{
                  padding: '8px 12px', borderRadius: '12px 12px 12px 2px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex', gap: 4, alignItems: 'center',
                }}>
                  {[0, 1, 2].map(j => (
                    <div key={j} style={{
                      width: 4, height: 4, borderRadius: '50%',
                      background: '#F59E0B',
                      animation: `typingBounce 0.9s ease-in-out ${j * 0.15}s infinite`,
                    }} />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Footer */}
            <div style={{
              padding: '8px 16px',
              borderTop: '1px solid rgba(255,255,255,0.04)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 9,
                color: 'rgba(245,245,245,0.2)', letterSpacing: '0.06em',
              }}>
                POWERED BY ORDA AI
              </span>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 9,
                color: 'rgba(245,245,245,0.2)', letterSpacing: '0.04em',
              }}>
                avg_latency: 0.9s
              </span>
            </div>
          </MagicCard>
        </motion.div>
      </div>
    </section>
  )
}
