'use client'

import { Globe, Zap, ShoppingBag, Bell, Store, CreditCard, Building2, MessageSquare } from 'lucide-react'
import { motion } from 'framer-motion'

const SPRING = { type: 'spring' as const, stiffness: 400, damping: 25 }

function BentoCard({
  icon: Icon,
  title,
  desc,
  colSpan,
  rowSpan,
  accent,
  delay,
}: {
  icon: React.ElementType
  title: string
  desc: string
  colSpan?: number
  rowSpan?: number
  accent?: boolean
  delay: number
}) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    e.currentTarget.style.background =
      `radial-gradient(400px circle at ${x}px ${y}px, rgba(255,255,255,0.03), rgba(255,255,255,0.01) 40%, transparent 80%)`
    const dist = Math.min(1, Math.sqrt(x * x + y * y) / 400)
    e.currentTarget.style.borderColor = `rgba(255,255,255,${0.06 + 0.08 * dist})`
  }
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.background = accent ? 'rgba(245,158,11,0.02)' : 'rgba(255,255,255,0.01)'
    e.currentTarget.style.borderColor = accent ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.06)'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ ...SPRING, delay }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        gridColumn: colSpan ? `span ${colSpan}` : undefined,
        gridRow: rowSpan ? `span ${rowSpan}` : undefined,
        background: accent ? 'rgba(245,158,11,0.02)' : 'rgba(255,255,255,0.01)',
        border: accent ? '1px solid rgba(245,158,11,0.15)' : '1px solid rgba(255,255,255,0.06)',
        borderRadius: 20,
        padding: '28px',
        overflow: 'hidden',
        cursor: 'default',
        transition: 'border-color 150ms ease',
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: accent ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.04)',
        border: accent ? '1px solid rgba(245,158,11,0.15)' : '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 18,
        color: accent ? '#F59E0B' : '#00FF66',
      }}>
        <Icon size={20} strokeWidth={1.5} />
      </div>
      <h3 style={{
        fontFamily: 'var(--font-body)',
        color: '#F5F5F5', fontSize: 15, fontWeight: 600, marginBottom: 8,
      }}>
        {title}
      </h3>
      <p style={{
        fontFamily: 'var(--font-body)',
        color: 'rgba(245,245,245,0.4)', fontSize: 13, lineHeight: 1.65,
      }}>
        {desc}
      </p>
    </motion.div>
  )
}

export default function Features() {
  return (
    <section id="features" style={{ background: '#050505', padding: '120px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={SPRING}
          style={{ marginBottom: 56 }}
        >
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10, letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#00FF66',
            marginBottom: 16,
          }}>
            FEATURE_SET · v2.1
          </div>
          <h2 style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 900,
            fontSize: 'clamp(36px, 5vw, 64px)',
            letterSpacing: '-0.03em',
            lineHeight: 0.92,
            color: '#F5F5F5',
          }}>
            Built for Every<br />
            <span style={{ color: '#F59E0B' }}>Business on Earth.</span>
          </h2>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
        }}>
          <BentoCard icon={MessageSquare} title="WhatsApp AI Agent" desc="Handles every customer message instantly. Takes orders, answers questions, collects payments — all inside WhatsApp. No app download. No friction." colSpan={2} rowSpan={2} accent delay={0} />
          <BentoCard icon={Globe} title="Speaks Every Language" desc="Detects and replies in any language. No setup required." colSpan={1} delay={0.04} />
          <BentoCard icon={Zap} title="Always On" desc="3am. Christmas. Any timezone. Never misses a message." colSpan={1} delay={0.08} />
          <BentoCard icon={CreditCard} title="Payments Inside Chat" desc="Customers pay without leaving the WhatsApp conversation." colSpan={2} delay={0.12} />
          <BentoCard icon={ShoppingBag} title="Order Management" desc="Full order flow. Inventory tracked. Notifications fired." colSpan={1} delay={0.16} />
          <BentoCard icon={Bell} title="Instant Notifications" desc="Owner and staff notified on every order, live." colSpan={1} delay={0.20} />
          <BentoCard icon={Store} title="Online Store Builder" desc="Beautiful public storefront. Shareable link. Zero code." colSpan={2} delay={0.24} />
          <BentoCard icon={Building2} title="Any Business" desc="Restaurant, boutique, pharmacy, salon — anywhere on Earth." colSpan={2} delay={0.28} />
        </div>
      </div>
    </section>
  )
}
