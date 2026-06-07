'use client'

import React from 'react'
import Link from 'next/link'
import NightGlobe from './NightGlobe'

export default function WhatsAppSection() {
  return (
    <section style={{ background: '#050505', padding: '140px 0', overflow: 'hidden', position: 'relative' }}>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40, position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontFamily: 'var(--font-mono)',
              fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: '#00FF66',
              background: 'rgba(0,255,102,0.04)',
              border: '1px solid rgba(0,255,102,0.15)',
              borderRadius: 100,
              padding: '4px 12px',
              width: 'fit-content',
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#00FF66', boxShadow: '0 0 6px #00FF66',
                animation: 'statusPulse 2s ease-in-out infinite',
                display: 'inline-block',
              }} />
              GLOBAL_INFRASTRUCTURE
            </span>
            <h2 style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: 900,
              fontSize: 'clamp(38px, 5vw, 72px)',
              letterSpacing: '-0.03em',
              color: '#F5F5F5',
              lineHeight: 0.9,
            }}>
              Your AI starts<br />earning immediately.
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 17, color: 'rgba(245,245,245,0.5)',
              lineHeight: 1.7, maxWidth: 480,
            }}>
              Every message answered. Every order captured. Every payment collected — the moment you connect.
            </p>
          </div>

          {/* Developer log card */}
          <div style={{
            background: '#000000',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16,
            overflow: 'hidden',
            maxWidth: 520,
          }}>
            {/* Terminal header */}
            <div style={{
              padding: '10px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.02)',
            }}>
              <div style={{ display: 'flex', gap: 5 }}>
                {['#FF5F57','#FEBC2E','#28C840'].map((c, i) => (
                  <div key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.6 }} />
                ))}
              </div>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 10,
                color: 'rgba(245,245,245,0.25)', letterSpacing: '0.06em', marginLeft: 6,
              }}>
                orda_agent · live_session
              </span>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{
                  width: 5, height: 5, borderRadius: '50%', background: '#00FF66',
                  boxShadow: '0 0 5px #00FF66', display: 'inline-block',
                  animation: 'statusPulse 2s ease-in-out infinite',
                }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#00FF66', letterSpacing: '0.06em' }}>LIVE</span>
              </div>
            </div>

            {/* Log output */}
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Timestamp */}
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 9,
                color: 'rgba(245,245,245,0.2)', letterSpacing: '0.05em',
              }}>
                [14:32:07.003] WHATSAPP_MESSAGE_RECEIVED
              </div>

              {/* Incoming message */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10,
                  color: 'rgba(245,245,245,0.35)', letterSpacing: '0.04em',
                }}>
                  CUSTOMER → +256-700-****21
                </div>
                <div style={{
                  padding: '8px 12px', borderRadius: '10px 10px 10px 2px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  fontFamily: 'var(--font-mono)', fontSize: 11,
                  color: 'rgba(245,245,245,0.7)', maxWidth: '85%',
                }}>
                  Is the Black Bomber Jacket in Size M still available?
                </div>
              </div>

              {/* AI reply */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-end' }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10,
                  color: 'rgba(245,245,245,0.35)', letterSpacing: '0.04em',
                }}>
                  ORDA_AI · latency: 0.9s
                </div>
                <div style={{
                  padding: '8px 12px', borderRadius: '10px 10px 2px 10px',
                  background: 'rgba(245,158,11,0.08)',
                  border: '1px solid rgba(245,158,11,0.2)',
                  fontFamily: 'var(--font-mono)', fontSize: 11,
                  color: 'rgba(245,245,245,0.85)', maxWidth: '85%', textAlign: 'left',
                }}>
                  Yes — 3 left in stock. Reserving one now. Payment link sent.
                </div>
              </div>

              {/* Payment confirmed */}
              <div style={{
                marginTop: 4,
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid #00FF66',
                background: 'rgba(0,255,102,0.04)',
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: '#00FF66',
                letterSpacing: '0.04em',
                lineHeight: 1.7,
              }}>
                {'> ORDER_CONFIRMED'}<br />
                {'  amount:  $89.00'}<br />
                {'  item:    Black Bomber Jacket × 1'}<br />
                {'  status:  PAYMENT_VERIFIED ✓'}<br />
                {'  latency: 312ms'}
              </div>
            </div>
          </div>

          <Link
            href="/sign-up"
            style={{
              display: 'inline-block', width: 'fit-content',
              padding: '13px 28px',
              background: '#F59E0B',
              borderRadius: 10,
              color: '#050505',
              fontFamily: 'var(--font-body)',
              fontSize: 15, fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Start Free Trial
          </Link>
        </div>

        {/* Right — Globe */}
        <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <NightGlobe />
        </div>
      </div>
    </section>
  )
}
