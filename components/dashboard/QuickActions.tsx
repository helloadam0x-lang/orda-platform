'use client'

import { useRouter } from 'next/navigation'
import { Megaphone, UserPlus, Plus, FileText } from 'lucide-react'

const ACTIONS = [
  { label: 'Send Broadcast', icon: Megaphone, href: '/dashboard/broadcasts/new' },
  { label: 'Add Contact', icon: UserPlus, href: null },
  { label: 'New Order', icon: Plus, href: '/dashboard/orders/new' },
  { label: 'View Reports', icon: FileText, href: '/dashboard/analytics' },
]

export default function QuickActions() {
  const router = useRouter()

  return (
    <div className="bg-orda-surface border border-orda-border rounded-[14px] p-6">
      <h2 className="text-orda-light font-bold font-space-grotesk text-base mb-5">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {ACTIONS.map(({ label, icon: Icon, href }) => (
          <button
            key={label}
            onClick={() => href && router.push(href)}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-orda-elevated border border-orda-border hover:border-orda-accent/40 hover:bg-orda-accent/10 transition-all group"
          >
            <Icon size={18} className="text-orda-accent" />
            <span className="text-orda-light text-[12px] font-medium text-center leading-tight">
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
