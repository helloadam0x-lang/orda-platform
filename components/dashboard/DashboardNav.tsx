'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, MessageSquare, BarChart2, Settings, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/conversations', label: 'Conversations', icon: MessageSquare },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function DashboardNav({ user }: { user: User }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/sign-in')
    router.refresh()
  }

  const initials = (user.user_metadata?.full_name as string | undefined)
    ?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() ?? 'U'

  return (
    <nav style={{ width: 240, flexShrink: 0, background: '#0A1200', borderRight: '1px solid #1a2400', display: 'flex', flexDirection: 'column', padding: '24px 0', minHeight: '100vh' }}>
      <div style={{ padding: '0 20px 24px', borderBottom: '1px solid #1a2400' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #8729A0, #6a1f80)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: 15 }}>O</div>
          <span style={{ color: '#E4F0F6', fontWeight: 700, fontSize: 18, fontFamily: 'Space Grotesk, sans-serif' }}>ORDA</span>
        </Link>
      </div>

      <div style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV_ITEMS.map(item => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                borderRadius: 8, textDecoration: 'none', transition: 'all 0.15s',
                background: active ? '#8729A015' : 'transparent',
                color: active ? '#E4F0F6' : '#8892A4',
                fontWeight: active ? 600 : 400, fontSize: 14,
                border: active ? '1px solid #8729A030' : '1px solid transparent',
              }}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          )
        })}
      </div>

      <div style={{ padding: '16px 20px', borderTop: '1px solid #1a2400' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #8729A0, #6a1f80)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 12 }}>{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: '#E4F0F6', fontSize: 13, fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {(user.user_metadata?.full_name as string | undefined) ?? 'User'}
            </p>
            <p style={{ color: '#8892A4', fontSize: 11, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: '1px solid #1a2400', borderRadius: 8, padding: '8px 12px', color: '#8892A4', fontSize: 13, cursor: 'pointer' }}
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </nav>
  )
}
