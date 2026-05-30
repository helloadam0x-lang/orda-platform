'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { playOrderSound } from '@/lib/sounds'

export default function NotificationSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(false)
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [settings, setSettings] = useState({
    notify_whatsapp: true,
    notify_daily_summary: true,
    notify_sound: true,
    notification_phone: '',
  })
  const [pushStatus, setPushStatus] = useState<'granted' | 'denied' | 'default'>('default')
  const supabase = createClient()

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushStatus(Notification.permission)
    }
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: biz } = await supabase
        .from('businesses')
        .select('id, notify_whatsapp, notify_daily_summary, notify_sound, notification_phone')
        .eq('user_id', user.id).single()
      if (biz) {
        setBusinessId(biz.id)
        setSettings({
          notify_whatsapp: biz.notify_whatsapp ?? true,
          notify_daily_summary: biz.notify_daily_summary ?? true,
          notify_sound: biz.notify_sound ?? true,
          notification_phone: biz.notification_phone || '',
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave() {
    if (!businessId) return
    setSaving(true)
    await supabase.from('businesses').update({
      notify_whatsapp: settings.notify_whatsapp,
      notify_daily_summary: settings.notify_daily_summary,
      notify_sound: settings.notify_sound,
      notification_phone: settings.notification_phone,
    }).eq('id', businessId)
    setSaving(false)
    setToast(true)
    setTimeout(() => setToast(false), 2000)
  }

  async function handleEnablePush() {
    if (!('Notification' in window)) return
    const permission = await Notification.requestPermission()
    setPushStatus(permission)
    if (permission === 'granted') {
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
    }
  }

  if (loading) return <div className="p-8 text-[rgba(239,239,239,0.50)]">Loading settings...</div>

  return (
    <div className="max-w-2xl text-[#EFEFEF]">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Notification Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#D4A853] text-[#050507] px-4 py-2 rounded-lg font-medium hover:bg-[#E0B968] disabled:opacity-50 transition-colors duration-150"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {toast && (
        <div className="fixed bottom-4 right-4 bg-[rgba(37,211,102,0.15)] text-[#25D366] border border-[rgba(37,211,102,0.3)] px-4 py-2 rounded-lg text-sm">
          Settings saved ✓
        </div>
      )}

      <div className="space-y-10">
        <section>
          <h2 className="text-[11px] font-semibold tracking-[0.10em] text-[#D4A853] uppercase mb-4">WhatsApp Alerts</h2>
          <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.07)] rounded-xl p-5 space-y-5">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-medium">New Orders</p>
                <p className="text-xs text-[rgba(239,239,239,0.40)] mt-0.5">Instant WhatsApp message when a customer places an order.</p>
              </div>
              <input type="checkbox" checked={settings.notify_whatsapp}
                onChange={e => setSettings({...settings, notify_whatsapp: e.target.checked})}
                className="w-4 h-4 accent-[#D4A853]" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-medium">Daily Summary & Weekly Report</p>
                <p className="text-xs text-[rgba(239,239,239,0.40)] mt-0.5">8:00 AM EAT daily stats + Monday performance review.</p>
              </div>
              <input type="checkbox" checked={settings.notify_daily_summary}
                onChange={e => setSettings({...settings, notify_daily_summary: e.target.checked})}
                className="w-4 h-4 accent-[#D4A853]" />
            </label>
            <div className="pt-3 border-t border-[rgba(255,255,255,0.07)]">
              <label className="block text-sm font-medium mb-2">Delivery Number <span className="text-[rgba(239,239,239,0.35)] font-normal">(optional)</span></label>
              <input type="text" value={settings.notification_phone}
                onChange={e => setSettings({...settings, notification_phone: e.target.value})}
                placeholder="e.g. +256 700 000 000"
                className="w-full bg-transparent border border-[rgba(255,255,255,0.07)] rounded-lg px-4 py-2 text-sm focus:border-[#D4A853] outline-none transition-colors duration-150" />
              <p className="text-xs text-[rgba(239,239,239,0.28)] mt-2">Leave blank to use your primary WhatsApp number.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-[11px] font-semibold tracking-[0.10em] text-[#D4A853] uppercase mb-4">Browser & Device</h2>
          <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.07)] rounded-xl p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-xs text-[rgba(239,239,239,0.40)] mt-0.5">Alerts in your system tray or mobile lock screen.</p>
              </div>
              {pushStatus === 'granted' ? (
                <span className="text-[#25D366] text-sm font-medium bg-[rgba(37,211,102,0.08)] px-3 py-1 rounded-full">Active ✓</span>
              ) : (
                <button onClick={handleEnablePush}
                  className="bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.1)] px-3 py-1.5 rounded-lg text-sm transition-colors duration-150">
                  Enable
                </button>
              )}
            </div>
            <div className="pt-3 border-t border-[rgba(255,255,255,0.07)]">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-medium">Dashboard Sounds</p>
                  <p className="text-xs text-[rgba(239,239,239,0.40)] mt-0.5">Play a sound when a new order or message arrives.</p>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={(e) => { e.preventDefault(); playOrderSound() }}
                    className="text-[#D4A853] text-xs hover:underline">Test</button>
                  <input type="checkbox" checked={settings.notify_sound}
                    onChange={e => setSettings({...settings, notify_sound: e.target.checked})}
                    className="w-4 h-4 accent-[#D4A853]" />
                </div>
              </label>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
