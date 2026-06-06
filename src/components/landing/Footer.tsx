'use client'

import Link from 'next/link'
import { OrdaLogo } from '@/components/shared/OrdaLogo'

const cols = [
  {
    label: 'PRODUCT',
    links: [
      { label: 'Features',      href: '/#features' },
      { label: 'Pricing',       href: '/#pricing' },
      { label: 'How It Works',  href: '/#how-it-works' },
      { label: 'Store Builder', href: '/dashboard/store' },
      { label: 'Payments',      href: '/dashboard/billing' },
      { label: 'WhatsApp',      href: '/dashboard/connect' },
    ],
  },
  {
    label: 'COMPANY',
    links: [
      { label: 'About',    href: '/#story' },
      { label: 'Blog',     href: '/' },
      { label: 'Careers',  href: '/' },
      { label: 'Press',    href: '/' },
      { label: 'Partners', href: '/' },
      { label: 'Contact',  href: 'mailto:hello@getorda.app' },
    ],
  },
  {
    label: 'SUPPORT',
    links: [
      { label: 'Help Center',    href: '/support' },
      { label: 'Documentation',  href: '/support' },
      { label: 'API Reference',  href: '/support' },
      { label: 'Status',         href: '/api/health' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms',          href: '/terms' },
    ],
  },
]

export default function Footer() {
  return (
    <footer
      className="py-20"
      style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-void)' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Top */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="flex flex-col gap-5">
            <OrdaLogo size="md" />
            <p className="font-body text-[13px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Every business. Always on.
            </p>
            <p className="font-body text-[12px] leading-relaxed" style={{ color: 'rgba(239,239,239,0.18)' }}>
              The AI platform for businesses worldwide. Connect WhatsApp. Run everything.
            </p>
          </div>

          {/* Link columns */}
          {cols.map(col => (
            <div key={col.label} className="flex flex-col gap-5">
              <div
                className="font-body text-[10px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: 'var(--text-muted)' }}
              >
                {col.label}
              </div>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-body text-[13px]"
                      style={{
                        color: 'rgba(239,239,239,0.22)',
                        transition: 'color 150ms cubic-bezier(0.23,1,0.32,1)',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(239,239,239,0.55)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(239,239,239,0.22)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: '1px solid var(--border-subtle)' }}
        >
          <p className="font-body text-[12px]" style={{ color: 'rgba(239,239,239,0.18)' }}>
            © {new Date().getFullYear()} Orda Technologies Ltd. All rights reserved.
          </p>
          <p className="font-body text-[12px]" style={{ color: 'rgba(239,239,239,0.18)' }}>
            Made with precision in Kampala, Uganda ·{' '}
            <span style={{ color: '#D4A853' }}>Powered by Orda</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
