'use client'

export default function Footer() {
  return (
    <footer className="py-16 border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[#8729A0] opacity-20 blur-lg" />
                <div className="w-2 h-2 rounded-full bg-[#C084FC] relative z-10" />
              </div>
              <span className="text-[14px] font-black tracking-[0.2em] text-white">ORDA</span>
            </div>
            <p className="text-[13px] text-white/35 leading-relaxed max-w-xs">
              Every business. Always on.
            </p>
            <p className="text-[12px] text-white/20 max-w-xs leading-relaxed">
              The universal AI platform for businesses worldwide. Connect WhatsApp. Run everything.
            </p>
          </div>

          {[
            { label: 'Product', links: ['Features', 'Pricing', 'How It Works', 'Integrations', 'Store Builder', 'Payments'] },
            { label: 'Company', links: ['About', 'Blog', 'Careers', 'Press', 'Partners', 'Contact'] },
            { label: 'Support', links: ['Help Center', 'Documentation', 'API Reference', 'Status', 'Privacy Policy', 'Terms'] },
          ].map(col => (
            <div key={col.label} className="flex flex-col gap-4">
              <div className="text-[11px] font-semibold text-white/25 tracking-[0.18em] uppercase">{col.label}</div>
              <ul className="space-y-2.5">
                {col.links.map(l => (
                  <li key={l}>
                    <a href="#" className="text-[13px] text-white/30 hover:text-white/60 transition-colors duration-200">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/[0.04] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-white/20">© {new Date().getFullYear()} Orda Technologies. All rights reserved.</p>
          <div className="flex items-center gap-2 text-[12px] text-white/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: 'pulse-glow 2s ease-in-out infinite' }} />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  )
}
