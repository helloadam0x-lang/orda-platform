'use client'

import { useState } from 'react'
import { Check, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Business } from '@/types/database'

const TABS = ['Business Profile', 'AI Configuration', 'Notifications', 'Team', 'Billing'] as const
type Tab = (typeof TABS)[number]

const AI_PERSONALITIES = [
  { id: 'professional', label: 'Professional', desc: 'Formal, concise, and business-focused responses.' },
  { id: 'friendly', label: 'Friendly', desc: 'Warm, conversational, and approachable tone.' },
  { id: 'formal', label: 'Formal', desc: 'Very structured, polite, and official language.' },
  { id: 'casual', label: 'Casual', desc: 'Relaxed, informal, and relatable messaging.' },
]

interface Props {
  business: Business
}

export default function SettingsForm({ business }: Props) {
  const [tab, setTab] = useState<Tab>('Business Profile')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Business Profile state
  const [profile, setProfile] = useState({
    name: business.name ?? '',
    phone: business.phone ?? '',
    email: business.email ?? '',
    country: business.country ?? '',
    city: '',
  })

  // AI config state
  const [ai, setAi] = useState({
    personality: business.ai_personality ?? 'friendly',
    auto_reply: business.auto_reply ?? true,
    greeting_message: business.greeting_message ?? '',
    hours_open: business.business_hours_open ?? '08:00',
    hours_close: business.business_hours_close ?? '18:00',
  })

  // Notifications state
  const [notifs, setNotifs] = useState({
    new_message: business.notify_new_message ?? true,
    new_order: business.notify_new_order ?? true,
    payment: business.notify_payment ?? true,
  })

  const showToast = (type: 'success' | 'error', text: string) => {
    setSaveMsg({ type, text })
    setTimeout(() => setSaveMsg(null), 3000)
  }

  const saveProfile = async () => {
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('businesses')
      .update({ name: profile.name, phone: profile.phone, email: profile.email, country: profile.country })
      .eq('id', business.id)
    setSaving(false)
    if (error) { showToast('error', error.message) } else { showToast('success', 'Business profile saved.') }
  }

  const saveAi = async () => {
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('businesses')
      .update({
        ai_personality: ai.personality,
        auto_reply: ai.auto_reply,
        greeting_message: ai.greeting_message,
        business_hours_open: ai.hours_open,
        business_hours_close: ai.hours_close,
      })
      .eq('id', business.id)
    setSaving(false)
    if (error) { showToast('error', error.message) } else { showToast('success', 'AI configuration saved.') }
  }

  const saveNotif = async (field: keyof typeof notifs, value: boolean) => {
    const updated = { ...notifs, [field]: value }
    setNotifs(updated)
    const supabase = createClient()
    await supabase
      .from('businesses')
      .update({
        notify_new_message: updated.new_message,
        notify_new_order: updated.new_order,
        notify_payment: updated.payment,
      })
      .eq('id', business.id)
  }

  const planLimit = business.plan === 'starter' ? 1000 : business.plan === 'growth' ? 5000 : null
  const expiresAt = business.plan_expires_at
    ? new Date(business.plan_expires_at).toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—'

  return (
    <div className="max-w-2xl space-y-0">
      {/* Toast */}
      {saveMsg && (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium mb-4 ${
            saveMsg.type === 'success'
              ? 'bg-orda-success/10 border border-orda-success/30 text-orda-success'
              : 'bg-orda-error/10 border border-orda-error/30 text-orda-error'
          }`}
        >
          {saveMsg.type === 'success' ? <Check size={15} /> : <AlertCircle size={15} />}
          {saveMsg.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-orda-surface border border-orda-border rounded-xl p-1 overflow-x-auto mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-[13px] font-medium whitespace-nowrap transition-all ${
              tab === t
                ? 'bg-orda-accent text-white'
                : 'text-orda-grey hover:text-orda-light hover:bg-white/[0.04]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Business Profile ── */}
      {tab === 'Business Profile' && (
        <div className="bg-orda-surface border border-orda-border rounded-[14px] p-6 space-y-5">
          <h2 className="text-orda-light font-bold font-space-grotesk text-base">Business Profile</h2>

          {[
            { label: 'Business Name', field: 'name', type: 'text', placeholder: 'Acme Store' },
            { label: 'Phone', field: 'phone', type: 'tel', placeholder: '+256 700 123 456' },
            { label: 'Email', field: 'email', type: 'email', placeholder: 'business@example.com' },
            { label: 'Country', field: 'country', type: 'text', placeholder: 'Uganda' },
            { label: 'City', field: 'city', type: 'text', placeholder: 'Kampala' },
          ].map(({ label, field, type, placeholder }) => (
            <div key={field}>
              <label className="block text-orda-grey text-[11px] uppercase tracking-wider mb-1.5 font-medium">
                {label}
              </label>
              <input
                type={type}
                value={profile[field as keyof typeof profile]}
                onChange={(e) => setProfile((p) => ({ ...p, [field]: e.target.value }))}
                placeholder={placeholder}
                className="w-full bg-orda-black border border-orda-border rounded-lg px-4 py-2.5 text-sm text-orda-light placeholder:text-orda-grey outline-none focus:border-orda-accent/50 transition-colors"
              />
            </div>
          ))}

          <button
            onClick={saveProfile}
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-orda-accent text-white font-semibold text-sm hover:bg-[#6a1f80] disabled:opacity-60 transition-colors"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      )}

      {/* ── AI Configuration ── */}
      {tab === 'AI Configuration' && (
        <div className="bg-orda-surface border border-orda-border rounded-[14px] p-6 space-y-6">
          <h2 className="text-orda-light font-bold font-space-grotesk text-base">AI Configuration</h2>

          {/* Personality */}
          <div>
            <label className="block text-orda-grey text-[11px] uppercase tracking-wider mb-3 font-medium">
              AI Personality
            </label>
            <div className="grid grid-cols-2 gap-3">
              {AI_PERSONALITIES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setAi((a) => ({ ...a, personality: p.id }))}
                  className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
                    ai.personality === p.id
                      ? 'border-orda-accent bg-orda-accent/10'
                      : 'border-orda-border hover:border-orda-accent/40 hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-orda-light text-sm font-semibold">{p.label}</span>
                    {ai.personality === p.id && (
                      <div className="w-4 h-4 rounded-full bg-orda-accent flex items-center justify-center">
                        <Check size={10} color="white" />
                      </div>
                    )}
                  </div>
                  <span className="text-orda-grey text-[11px] leading-relaxed">{p.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Auto reply toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orda-light text-sm font-medium">Auto Reply</p>
              <p className="text-orda-grey text-[12px]">Automatically reply to incoming messages</p>
            </div>
            <button
              onClick={() => setAi((a) => ({ ...a, auto_reply: !a.auto_reply }))}
              className={`w-11 h-6 rounded-full transition-colors relative ${ai.auto_reply ? 'bg-orda-accent' : 'bg-orda-border'}`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${ai.auto_reply ? 'translate-x-5' : 'translate-x-0.5'}`}
              />
            </button>
          </div>

          {/* Business hours */}
          <div>
            <label className="block text-orda-grey text-[11px] uppercase tracking-wider mb-3 font-medium">
              Business Hours
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-orda-grey text-[11px] mb-1">Opens</p>
                <input
                  type="time"
                  value={ai.hours_open}
                  onChange={(e) => setAi((a) => ({ ...a, hours_open: e.target.value }))}
                  className="w-full bg-orda-black border border-orda-border rounded-lg px-3 py-2.5 text-sm text-orda-light outline-none focus:border-orda-accent/50"
                />
              </div>
              <span className="text-orda-grey text-sm mt-4">to</span>
              <div className="flex-1">
                <p className="text-orda-grey text-[11px] mb-1">Closes</p>
                <input
                  type="time"
                  value={ai.hours_close}
                  onChange={(e) => setAi((a) => ({ ...a, hours_close: e.target.value }))}
                  className="w-full bg-orda-black border border-orda-border rounded-lg px-3 py-2.5 text-sm text-orda-light outline-none focus:border-orda-accent/50"
                />
              </div>
            </div>
          </div>

          {/* Greeting */}
          <div>
            <label className="block text-orda-grey text-[11px] uppercase tracking-wider mb-1.5 font-medium">
              Custom Greeting Message
            </label>
            <textarea
              value={ai.greeting_message}
              onChange={(e) => setAi((a) => ({ ...a, greeting_message: e.target.value }))}
              placeholder="Hi! Welcome to our store. How can I help you today?"
              rows={3}
              className="w-full bg-orda-black border border-orda-border rounded-lg px-4 py-2.5 text-sm text-orda-light placeholder:text-orda-grey outline-none focus:border-orda-accent/50 resize-none"
            />
          </div>

          <button
            onClick={saveAi}
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-orda-accent text-white font-semibold text-sm hover:bg-[#6a1f80] disabled:opacity-60 transition-colors"
          >
            {saving ? 'Saving…' : 'Save Configuration'}
          </button>
        </div>
      )}

      {/* ── Notifications ── */}
      {tab === 'Notifications' && (
        <div className="bg-orda-surface border border-orda-border rounded-[14px] p-6 space-y-0">
          <h2 className="text-orda-light font-bold font-space-grotesk text-base mb-5">Notifications</h2>
          {[
            { field: 'new_message' as keyof typeof notifs, label: 'New Message', desc: 'Get notified when a new message arrives' },
            { field: 'new_order' as keyof typeof notifs, label: 'New Order', desc: 'Get notified when an order is placed' },
            { field: 'payment' as keyof typeof notifs, label: 'Payment Received', desc: 'Get notified when a payment is collected' },
          ].map(({ field, label, desc }) => (
            <div key={field} className="flex items-center justify-between py-4 border-b border-orda-border/50 last:border-0">
              <div>
                <p className="text-orda-light text-sm font-medium">{label}</p>
                <p className="text-orda-grey text-[12px] mt-0.5">{desc}</p>
              </div>
              <button
                onClick={() => saveNotif(field, !notifs[field])}
                className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${notifs[field] ? 'bg-orda-accent' : 'bg-orda-border'}`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${notifs[field] ? 'translate-x-5' : 'translate-x-0.5'}`}
                />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Team ── */}
      {tab === 'Team' && (
        <div className="bg-orda-surface border border-orda-border rounded-[14px] p-6">
          <h2 className="text-orda-light font-bold font-space-grotesk text-base mb-2">Team Members</h2>
          <p className="text-orda-grey text-sm mb-6">Invite team members to manage your Orda account.</p>
          <div className="flex items-center justify-center h-32 border border-dashed border-orda-border rounded-xl">
            <p className="text-orda-grey text-sm">Team management coming soon.</p>
          </div>
        </div>
      )}

      {/* ── Billing ── */}
      {tab === 'Billing' && (
        <div className="space-y-4">
          {/* Current plan */}
          <div className="bg-orda-surface border border-orda-border rounded-[14px] p-6 space-y-4">
            <h2 className="text-orda-light font-bold font-space-grotesk text-base">Current Plan</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orda-light font-semibold capitalize text-lg">{business.plan} Plan</p>
                <p className="text-orda-grey text-[13px] mt-0.5">Expires {expiresAt}</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-orda-accent/15 border border-orda-accent/30 text-orda-accent text-xs font-semibold capitalize">
                {business.plan}
              </span>
            </div>

            {/* Usage bar */}
            {planLimit && (
              <div>
                <div className="flex justify-between text-[12px] mb-1.5">
                  <span className="text-orda-grey">Messages used this month</span>
                  <span className="text-orda-light font-medium">0 / {planLimit.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-orda-border rounded-full overflow-hidden">
                  <div className="h-full bg-orda-accent rounded-full" style={{ width: '0%' }} />
                </div>
              </div>
            )}
          </div>

          {/* Upgrade options */}
          <div className="bg-orda-surface border border-orda-border rounded-[14px] p-6 space-y-3">
            <h3 className="text-orda-light font-semibold text-sm mb-4">Upgrade Plan</h3>
            {[
              { id: 'starter', name: 'Starter', price: '$29/mo', limit: '1,000 messages' },
              { id: 'growth', name: 'Growth', price: '$59/mo', limit: '5,000 messages', popular: true },
              { id: 'premium', name: 'Premium', price: '$99/mo', limit: 'Unlimited messages' },
            ].map((plan) => (
              <div
                key={plan.id}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  business.plan === plan.id
                    ? 'border-orda-accent bg-orda-accent/5'
                    : 'border-orda-border hover:border-orda-accent/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  {business.plan === plan.id && (
                    <div className="w-4 h-4 rounded-full bg-orda-accent flex items-center justify-center">
                      <Check size={10} color="white" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-orda-light text-sm font-semibold">{plan.name}</span>
                      {plan.popular && (
                        <span className="px-1.5 py-0.5 rounded-full bg-orda-accent text-white text-[9px] font-bold">
                          POPULAR
                        </span>
                      )}
                    </div>
                    <p className="text-orda-grey text-[11px]">{plan.limit}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-orda-light font-bold text-sm">{plan.price}</span>
                  {business.plan !== plan.id && (
                    <button className="px-3 py-1.5 rounded-lg bg-orda-accent text-white text-xs font-semibold hover:bg-[#6a1f80] transition-colors">
                      Upgrade
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Cancel */}
          <div className="bg-orda-surface border border-orda-border rounded-[14px] p-6">
            <h3 className="text-orda-light font-semibold text-sm mb-1">Cancel Subscription</h3>
            <p className="text-orda-grey text-[13px] mb-4">
              Cancelling will downgrade you to the free plan at the end of your billing period.
            </p>
            <button className="px-4 py-2 rounded-lg border border-orda-error/40 text-orda-error text-sm font-medium hover:bg-orda-error/10 transition-colors">
              Cancel Subscription
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
