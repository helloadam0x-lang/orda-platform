'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, MessageSquare, ShoppingBag, Store, Users,
  BarChart2, Radio, Globe, CreditCard, Monitor, Star,
  Settings, LogOut, X,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/conversations', icon: MessageSquare, label: 'Conversations' },
  { href: '/dashboard/orders', icon: ShoppingBag, label: 'Orders' },
  { href: '/dashboard/store', icon: Store, label: 'Store' },
  { href: '/dashboard/contacts', icon: Users, label: 'Contacts' },
  { href: '/dashboard/analytics', icon: BarChart2, label: 'Analytics' },
  { href: '/dashboard/broadcasts', icon: Radio, label: 'Broadcasts' },
  { href: '/dashboard/website', icon: Globe, label: 'My Website' },
  { href: '/dashboard/billing', icon: CreditCard, label: 'Billing' },
  { href: '/dashboard/pos', icon: Monitor, label: 'POS' },
  { href: '/dashboard/referrals', icon: Star, label: 'Referrals' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

interface SidebarProps {
  userName: string
  userEmail: string
  plan: string
  onClose?: () => void
}

export function Sidebar({ userName, userEmail, plan, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/sign-in')
  }

  const planLabel = plan === 'pro' ? 'Pro' : plan === 'starter' ? 'Starter' : 'Trial'
  const planColor = plan === 'pro' ? '#22C55E' : plan === 'starter' ? '#D4A853' : '#94A3B8'

  return (
    <aside
      style={{ background: 'var(--surface-1)', borderRight: '1px solid var(--border)' }}
      className="flex flex-col w-60 h-full shrink-0 select-none"
    >
      {/* Logo + close (mobile) */}
      <div className="flex items-center justify-between px-5 h-16 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
        <Link href="/dashboard" className="font-['Playfair_Display'] font-black text-xl text-[var(--text-1)]">
          ORDA<span style={{ color: 'var(--accent)' }}>.</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded text-[var(--text-3)] hover:text-[var(--text-1)]">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              style={active ? {
                background: 'var(--accent-dim)',
                borderLeft: '2px solid var(--accent)',
                color: 'var(--accent)',
              } : {
                borderLeft: '2px solid transparent',
                color: 'var(--text-2)',
              }}
              className={[
                'flex items-center gap-3 px-3 py-2 rounded-r-[var(--r-md)] text-[13px] font-medium transition-colors duration-150',
                active ? '' : 'hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]',
              ].join(' ')}
            >
              <Icon size={16} strokeWidth={active ? 2.5 : 2} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="shrink-0 p-3" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3 px-2 py-2 rounded-[var(--r-md)]">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-[var(--void)] shrink-0"
            style={{ background: 'var(--accent)' }}
          >
            {userName.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-[var(--text-1)] truncate">{userName}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                style={{ background: `${planColor}20`, color: planColor }}
              >
                {planLabel}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 mt-1 rounded-[var(--r-md)] text-[13px] text-[var(--text-3)] hover:text-[var(--error)] hover:bg-[var(--error-dim)] transition-colors duration-150"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
