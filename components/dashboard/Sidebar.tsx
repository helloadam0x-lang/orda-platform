'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, MessageSquare, Users, ShoppingBag,
  Megaphone, CreditCard, Store, BarChart2, Settings, LogOut, X,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getInitials } from '@/lib/utils'
import type { Business } from '@/types/database'

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/conversations', label: 'Conversations', icon: MessageSquare },
  { href: '/dashboard/contacts', label: 'Contacts', icon: Users },
  { href: '/dashboard/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/dashboard/broadcasts', label: 'Broadcasts', icon: Megaphone },
  { href: '/dashboard/payments', label: 'Payments', icon: CreditCard },
  { href: '/dashboard/storefront', label: 'Storefront', icon: Store },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

interface Props {
  business: Business | null
  userName: string
  userEmail: string
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ business, userName, userEmail, isOpen, onClose }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/sign-in')
    router.refresh()
  }

  return (
    <aside
      className={`fixed top-0 left-0 z-30 h-full w-[260px] bg-orda-surface border-r border-orda-border flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
    >
      {/* Logo + business name */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-orda-border">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orda-accent to-[#6a1f80] flex items-center justify-center text-white font-black text-sm flex-shrink-0">
              O
            </div>
            <span className="text-orda-light font-bold font-space-grotesk text-lg tracking-tight">ORDA</span>
          </div>
          {business && (
            <p className="text-orda-grey text-[11px] truncate max-w-[190px] pl-0.5">{business.name}</p>
          )}
        </div>
        <button onClick={onClose} className="lg:hidden text-orda-grey hover:text-orda-light flex-shrink-0 ml-2">
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group border-l-2 ${
                active
                  ? 'bg-orda-accent/10 text-orda-light border-orda-accent'
                  : 'text-orda-grey hover:bg-white/[0.04] hover:text-orda-light border-transparent'
              }`}
            >
              <Icon
                size={16}
                className={active ? 'text-orda-accent' : 'text-orda-grey group-hover:text-orda-light'}
              />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-orda-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orda-accent to-[#6a1f80] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {getInitials(userName)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-orda-light text-xs font-semibold truncate">{userName}</p>
            <p className="text-orda-grey text-[10px] truncate">{userEmail}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-orda-grey hover:text-orda-error hover:bg-orda-error/10 text-xs font-medium transition-all"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
