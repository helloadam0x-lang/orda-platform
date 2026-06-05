'use client'

import { useState } from 'react'
import { Menu, Bell } from 'lucide-react'
import { Sidebar } from './Sidebar'

interface HeaderProps {
  title: string
  userName: string
  userEmail: string
  plan: string
}

export function Header({ title, userName, userEmail, plan }: HeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <header
        className="flex items-center justify-between px-5 h-14 shrink-0 md:hidden"
        style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border)' }}
      >
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-2 rounded-[var(--r-sm)] text-[var(--text-2)] hover:text-[var(--text-1)]"
          style={{ transition: 'color 200ms var(--ease)' }}
        >
          <Menu size={20} />
        </button>
        <span className="font-['Playfair_Display'] font-black text-base text-[var(--text-1)]">
          ORDA<span style={{ color: 'var(--accent)' }}>.</span>
        </span>
        <div className="w-8" />
      </header>

      {/* Mobile sidebar drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative z-10 h-full animate-[slideInRight_320ms_var(--ease)_both]" style={{ width: 240 }}>
            <Sidebar
              userName={userName}
              userEmail={userEmail}
              plan={plan}
              onClose={() => setDrawerOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  )
}
