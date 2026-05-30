'use client'

import { useState, useEffect } from 'react'
import { Bell, X } from 'lucide-react'

export function PushPermissionBanner({ businessId }: { businessId: string }) {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!('Notification' in window)) return
    if (Notification.permission === 'default') setShow(true)
  }, [])

  async function enable() {
    setLoading(true)
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') { setShow(false); return }

      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      })
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub.toJSON() }),
      })
      setShow(false)
    } catch (err) {
      console.error('Push subscription failed:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!show) return null

  return (
    <div className="flex items-center justify-between p-3 mb-5 rounded-xl bg-[#D4A853]/10 border border-[#D4A853]/20">
      <div className="flex items-center gap-3">
        <Bell size={18} color="#D4A853" strokeWidth={2} />
        <div>
          <span className="text-[#EFEFEF] text-sm font-medium block sm:inline">
            Get notified of new orders — even when this tab is closed.
          </span>
          <span className="text-[#EFEFEF]/40 text-xs sm:ml-2 block sm:inline">
            Works on your phone too.
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3 ml-4">
        <button
          onClick={enable}
          disabled={loading}
          className="whitespace-nowrap px-4 py-2 bg-[#D4A853] hover:bg-[#D4A853]/90 transition-colors rounded-lg text-[#050507] text-xs font-bold cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Enabling...' : 'Enable'}
        </button>
        <button
          onClick={() => setShow(false)}
          className="bg-transparent border-none cursor-pointer text-[#EFEFEF]/30 hover:text-[#EFEFEF] p-1 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
