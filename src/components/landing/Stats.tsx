'use client'

import { motion } from 'framer-motion'

const SPRING = { type: 'spring' as const, stiffness: 400, damping: 25 }

const stats = [
  { display: '2.4M+', label: 'Messages Handled', green: true },
  { display: '54',    label: 'Countries',         green: false },
  { display: '500+',  label: 'Businesses',        green: false },
]

export default function Stats() {
  return (
    <section style={{
      background: '#050505',
      borderTop: '1px solid rgba(255,255,255,0.04)',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      padding: '64px 0',
    }}>
      <div style={{
        maxWidth: '900px', margin: '0 auto', padding: '0 24px',
        display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
        gap: 0,
      }}>
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ ...SPRING, delay: i * 0.06 }}
            style={{
              textAlign: 'center',
              padding: '20px',
              borderRight: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}
          >
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: 'clamp(40px, 6vw, 68px)',
              letterSpacing: '-0.03em',
              color: stat.green ? '#00FF66' : '#F5F5F5',
              lineHeight: 1,
            }}>
              {stat.display}
            </div>
            <p style={{
              marginTop: 10, fontSize: 10,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)',
              color: 'rgba(245,245,245,0.28)',
            }}>
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
