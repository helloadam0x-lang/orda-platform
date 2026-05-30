'use client'

import { PushPermissionBanner } from './PushPermissionBanner'
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications'

interface DashboardShellProps {
  businessId: string
  children: React.ReactNode
}

export function DashboardShell({ businessId, children }: DashboardShellProps) {
  useRealtimeNotifications(businessId)

  return (
    <>
      <PushPermissionBanner businessId={businessId} />
      {children}
    </>
  )
}
