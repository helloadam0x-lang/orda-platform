'use client'

export default function Footer() {
  const cols = [
    { label: 'PRODUCT', links: ['Features', 'Pricing', 'How It Works', 'Integrations', 'Store Builder', 'Payments'] },
    { label: 'COMPANY', links: ['About', 'Blog', 'Careers', 'Press', 'Partners', 'Contact'] },
    { label: 'SUPPORT', links: ['Help Center', 'Documentation', 'API Reference', 'Status', 'Privacy Policy', 'Terms'] },
  ]

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
            <span
              className="font-display text-[15px] font-bold tracking-[0.1em] uppercase"
              style={{ color: 'var(--text-primary)' }}
            >
              ORDA
            </span>
            <p className="font-body text-[13px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Every business. Always on.
            </p>
            <p className="font-body text-[12px] leading-relaxed" style={{ color: 'rgba(239,239,239,0.18)' }}>
              The universal AI platform for businesses worldwide. Connect WhatsApp. Run everything.
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
                {col.links.map(l => (
                  <li key={l}>
                    <a
                      href="#"
                      className="font-body text-[13px] transition-colors duration-[150ms]"
                      style={{ color: 'rgba(239,239,239,0.22)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(239,239,239,0.55)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(239,239,239,0.22)' }}
                    >
                      {l}
                    </a>
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
            © {new Date().getFullYear()} Orda Technologies. All rights reserved.
          </p>
          <p className="font-body text-[12px]" style={{ color: 'rgba(239,239,239,0.18)' }}>
            Made with precision
          </p>
        </div>
      </div>
    </footer>
  )
}
