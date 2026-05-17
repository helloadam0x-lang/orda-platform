'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import TopNav from './TopNav'
import type { Business } from '@/types/database'

interface Props {
  children: React.ReactNode
  business: Business | null
  userName: string
  userEmail: string
}

export default function DashboardShell({ children, business, userName, userEmail }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-orda-black">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        business={business}
        userName={userName}
        userEmail={userEmail}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-col flex-1 overflow-hidden lg:ml-[260px]">
        <TopNav
          onMenuClick={() => setSidebarOpen(true)}
          userName={userName}
          plan={business?.plan ?? 'trial'}
        />
        <main className="flex-1 overflow-y-auto p-5 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
