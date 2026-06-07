'use client'

import { motion } from 'framer-motion'

const metrics = [
  { label: 'UPTIME',    val: '99.99%' },
  { label: 'AVG REPLY', val: '0.9s' },
  { label: 'MSGS/MIN',  val: '10,000+' },
  { label: 'LATENCY',   val: '<100ms' },
  { label: 'COUNTRIES', val: '54' },
  { label: 'ORDERS',    val: '2.4M+' },
  { label: 'FRAUD',     val: '$0' },
  { label: 'SUCCESS',   val: '99.97%' },
  { label: 'UPTIME',    val: '99.99%' },
  { label: 'AVG REPLY', val: '0.9s' },
  { label: 'MSGS/MIN',  val: '10,000+' },
  { label: 'LATENCY',   val: '<100ms' },
  { label: 'COUNTRIES', val: '54' },
  { label: 'ORDERS',    val: '2.4M+' },
  { label: 'FRAUD',     val: '$0' },
  { label: 'SUCCESS',   val: '99.97%' },
]

function MetricCard({ label, val }: { label: string; val: string }) {
  return (
    <div
      className="infra-metric-card"
      style={{ marginRight: 12 }}
    >
      <span style={{ color: 'rgba(245,245,245,0.3)' }}>{label}&nbsp;&nbsp;</span>
      <span className="metric-val">{val}</span>
    </div>
  )
}

export default function Testimonials() {
  return (
    <section id="testimonials" style={{ background: '#050505', padding: '80px 0', overflow: 'hidden' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        style={{ textAlign: 'center', marginBottom: 48 }}
      >
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10, letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#00FF66',
          marginBottom: 14,
        }}>
          SYSTEM_STATUS · LIVE
        </div>
        <h2 style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontWeight: 900,
          fontSize: 'clamp(32px, 4vw, 56px)',
          letterSpacing: '-0.03em',
          color: '#F5F5F5',
        }}>
          Infrastructure You Can<br />
          <span style={{ color: '#F59E0B' }}>Measure.</span>
        </h2>
      </motion.div>

      {/* Marquee row 1 */}
      <div style={{ overflow: 'hidden', marginBottom: 12 }}>
        <div className="infra-marquee-track">
          {metrics.map((m, i) => <MetricCard key={i} {...m} />)}
        </div>
      </div>

      {/* Marquee row 2 — reversed */}
      <div style={{ overflow: 'hidden' }}>
        <div
          className="infra-marquee-track"
          style={{ animationDirection: 'reverse' }}
        >
          {[...metrics].reverse().map((m, i) => <MetricCard key={i} {...m} />)}
        </div>
      </div>
    </section>
  )
}
