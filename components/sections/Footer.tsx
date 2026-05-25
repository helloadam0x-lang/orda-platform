'use client'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="py-16 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="relative w-7 h-7 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-accent opacity-20 blur-md" />
                <div className="w-2 h-2 rounded-full bg-accent-light relative z-10" />
              </div>
              <span className="text-base font-bold tracking-widest text-text-primary">ORDA</span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed max-w-xs">
              The universal AI business platform. Connect WhatsApp. Run everything. Sleep well.
            </p>
            <div className="flex items-center gap-3 mt-2">
              {['twitter', 'instagram', 'linkedin'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-8 h-8 rounded-full glass-card border border-white/8 flex items-center justify-center text-text-muted hover:text-text-primary hover:border-white/15 transition-all duration-200"
                >
                  <span className="text-xs capitalize">{social.charAt(0).toUpperCase()}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div className="flex flex-col gap-4">
            <div className="text-xs font-semibold text-text-muted tracking-widest uppercase">Product</div>
            <ul className="flex flex-col gap-3">
              {['Features', 'Pricing', 'How It Works', 'Integrations', 'Store Builder', 'Payments'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-text-muted hover:text-text-primary transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-4">
            <div className="text-xs font-semibold text-text-muted tracking-widest uppercase">Company</div>
            <ul className="flex flex-col gap-3">
              {['About', 'Blog', 'Careers', 'Press', 'Partners', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-text-muted hover:text-text-primary transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-4">
            <div className="text-xs font-semibold text-text-muted tracking-widest uppercase">Support</div>
            <ul className="flex flex-col gap-3">
              {['Help Center', 'Documentation', 'API Reference', 'Status', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-text-muted hover:text-text-primary transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            © {year} Orda Technologies. All rights reserved.
          </p>
          <p className="text-xs text-text-muted flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse_ring" />
            All systems operational · 99.9% uptime
          </p>
        </div>
      </div>
    </footer>
  )
}
