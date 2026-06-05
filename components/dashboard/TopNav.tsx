'use client'

import { usePathname } from 'next/navigation'
import { Menu, Bell } from 'lucide-react'
import { getInitials } from '@/lib/utils'

const SECTIONS: Record<string, string> = {
  '/dashboard/conversations': 'Conversations',
  '/dashboard/contacts': 'Contacts',
  '/dashboard/orders': 'Orders',
  '/dashboard/broadcasts': 'Broadcasts',
  '/dashboard/payments': 'Payments',
  '/dashboard/storefront': 'Storefront',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/settings': 'Settings',
  '/dashboard': 'Overview',
}

interface Props {
  onMenuClick: () => void
  userName: string
  plan: string
}

export default function TopNav({ onMenuClick, userName, plan }: Props) {
  const pathname = usePathname()

  const section =
    Object.keys(SECTIONS)
      .filter((k) => pathname.startsWith(k))
      .sort((a, b) => b.length - a.length)[0] ?? '/dashboard'

  return (
    <header className="h-16 flex-shrink-0 flex items-center justify-between px-5 lg:px-8 bg-orda-black border-b border-orda-border">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-orda-grey hover:text-orda-light transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-orda-light font-bold font-space-grotesk text-lg leading-none">
          {SECTIONS[section]}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orda-accent/10 border border-orda-accent/30 text-orda-accent capitalize">
          {plan}
        </span>
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-orda-grey hover:text-orda-light hover:bg-white/[0.04] transition-all">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orda-accent rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orda-accent to-[#6a1f80] flex items-center justify-center text-white text-xs font-bold">
          {getInitials(userName)}
        </div>
      </div>
    </header>
  )
}
