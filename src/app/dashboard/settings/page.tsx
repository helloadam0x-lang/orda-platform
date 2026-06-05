'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Settings, User, Bot, CreditCard, Users, Bell, Shield, Save, Send } from 'lucide-react'
import { AI_FIRMNESS_LEVELS } from '@/lib/aiFirmness'

const PERSONALITIES = [
  { id: 'professional', label: 'Professional', icon: '🏛️', example: 'Good day. How may I assist you today?' },
  { id: 'friendly', label: 'Friendly', icon: '😊', example: 'Hey! Great to hear from you. How can I help?' },
  { id: 'luxury', label: 'Luxury', icon: '✨', example: 'Welcome. It\'s our pleasure to assist you.' },
]

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'ai', label: 'AI', icon: Bot },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
]

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [business, setBusiness] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('profile')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [testMessage, setTestMessage] = useState('')
  const [testReply, setTestReply] = useState('')
  const [testLoading, setTestLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/sign-in'); return }
      supabase.from('businesses').select('*').eq('user_id', user.id).single()
        .then(({ data }) => { if (data) setBusiness(data); setLoading(false) })
    })
  }, [])

  async function save(patch: Record<string, any>) {
    if (!business) return
    setSaving(true)
    await supabase.from('businesses').update(patch).eq('id', business.id)
    setBusiness((b: any) => ({ ...b, ...patch }))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function testAI() {
    if (!testMessage || !business) return
    setTestLoading(true)
    try {
      const res = await fetch('/api/store/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: business.slug, message: testMessage, history: [] }),
      })
      const reader = res.body?.getReader()
      let reply = ''
      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          reply += new TextDecoder().decode(value)
        }
      }
      setTestReply(reply.replace(/data: /g, '').trim())
    } catch {
      setTestReply('Error — check your AI settings.')
    }
    setTestLoading(false)
  }

  if (loading) return <div className="p-6 space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 skeleton rounded-[var(--r-lg)]" />)}</div>

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="font-['Playfair_Display'] font-black text-2xl text-[var(--text-1)]">Settings</h1>
        <p className="text-[13px] text-[var(--text-3)] mt-1">Manage your business configuration</p>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Left nav */}
        <div className="lg:w-48 shrink-0">
          <nav className="space-y-1">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[var(--r-md)] text-[13px] font-medium text-left transition-colors duration-150"
                style={{
                  background: tab === t.id ? 'var(--accent-dim)' : 'transparent',
                  color: tab === t.id ? 'var(--accent)' : 'var(--text-2)',
                  border: tab === t.id ? '1px solid var(--accent-border)' : '1px solid transparent',
                }}
              >
                <t.icon size={14} />
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-5">
          {tab === 'profile' && (
            <div className="rounded-[var(--r-xl)] p-5 space-y-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
              <div className="text-[14px] font-semibold text-[var(--text-1)]">Business Profile</div>
              {[
                { key: 'name', label: 'Business Name', type: 'input' },
                { key: 'tagline', label: 'Tagline', type: 'input' },
                { key: 'city', label: 'City', type: 'input' },
                { key: 'description', label: 'Description', type: 'textarea' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-[12px] uppercase tracking-wide text-[var(--text-3)] mb-1.5 block">{f.label}</label>
                  {f.type === 'input' ? (
                    <input
                      defaultValue={business?.[f.key] ?? ''}
                      onBlur={e => save({ [f.key]: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-3)] text-[var(--text-1)] placeholder:text-[var(--text-3)] outline-none"
                      style={{ border: '1px solid var(--border)' }}
                    />
                  ) : (
                    <textarea
                      defaultValue={business?.[f.key] ?? ''}
                      onBlur={e => save({ [f.key]: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2.5 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-3)] text-[var(--text-1)] placeholder:text-[var(--text-3)] outline-none resize-none"
                      style={{ border: '1px solid var(--border)' }}
                    />
                  )}
                </div>
              ))}
              <div>
                <label className="text-[12px] uppercase tracking-wide text-[var(--text-3)] mb-1.5 block">Currency</label>
                <select
                  defaultValue={business?.currency ?? 'USD'}
                  onChange={e => save({ currency: e.target.value })}
                  className="px-3 py-2.5 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-3)] text-[var(--text-1)] outline-none"
                  style={{ border: '1px solid var(--border)' }}
                >
                  {['USD', 'UGX', 'KES', 'EUR', 'GBP'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          )}

          {tab === 'ai' && (
            <div className="space-y-5">
              <div className="rounded-[var(--r-xl)] p-5 space-y-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <div className="text-[14px] font-semibold text-[var(--text-1)]">AI Personality</div>
                <div className="grid grid-cols-3 gap-3">
                  {PERSONALITIES.map(p => (
                    <button
                      key={p.id}
                      onClick={() => save({ ai_personality: p.id })}
                      className="rounded-[var(--r-lg)] p-4 text-left transition-all duration-150"
                      style={{
                        background: business?.ai_personality === p.id ? 'var(--accent-dim)' : 'var(--surface-3)',
                        border: `1px solid ${business?.ai_personality === p.id ? 'var(--accent)' : 'var(--border)'}`,
                      }}
                    >
                      <div className="text-2xl mb-2">{p.icon}</div>
                      <div className="text-[13px] font-semibold text-[var(--text-1)]">{p.label}</div>
                      <div className="text-[11px] text-[var(--text-3)] mt-1 leading-relaxed">"{p.example}"</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[var(--r-xl)] p-5 space-y-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <div className="text-[14px] font-semibold text-[var(--text-1)]">Firmness</div>
                <div className="grid grid-cols-2 gap-3">
                  {AI_FIRMNESS_LEVELS.map(f => (
                    <button
                      key={f.id}
                      onClick={() => save({ ai_firmness: f.id })}
                      className="rounded-[var(--r-lg)] p-4 text-left transition-all duration-150"
                      style={{
                        background: business?.ai_firmness === f.id ? 'var(--accent-dim)' : 'var(--surface-3)',
                        border: `1px solid ${business?.ai_firmness === f.id ? 'var(--accent)' : 'var(--border)'}`,
                      }}
                    >
                      <div className="text-xl mb-1">{f.icon}</div>
                      <div className="text-[13px] font-semibold text-[var(--text-1)]">{f.label}</div>
                      <div className="text-[11px] text-[var(--text-3)] mt-1">{f.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[var(--r-xl)] p-5 space-y-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <div className="text-[14px] font-semibold text-[var(--text-1)]">AI Configuration</div>
                <div>
                  <label className="text-[12px] uppercase tracking-wide text-[var(--text-3)] mb-1.5 block">Greeting Message</label>
                  <textarea
                    defaultValue={business?.ai_greeting ?? ''}
                    onBlur={e => save({ ai_greeting: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-3)] text-[var(--text-1)] outline-none resize-none"
                    style={{ border: '1px solid var(--border)' }}
                    placeholder="Hello! Welcome to {business_name}. How can I help you today?"
                  />
                </div>
                <div>
                  <label className="text-[12px] uppercase tracking-wide text-[var(--text-3)] mb-1.5 block">Custom Rules</label>
                  <textarea
                    defaultValue={business?.ai_custom_rules ?? ''}
                    onBlur={e => save({ ai_custom_rules: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2.5 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-3)] text-[var(--text-1)] outline-none resize-none"
                    style={{ border: '1px solid var(--border)' }}
                    placeholder="e.g. Always mention our delivery fee. Never offer more than 10% discount."
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[13px] font-medium text-[var(--text-1)]">Allow Discounts</div>
                    <div className="text-[12px] text-[var(--text-3)]">AI can offer discounts to customers</div>
                  </div>
                  <button
                    onClick={() => save({ allow_discounts: !business?.allow_discounts })}
                    className="w-10 h-5 rounded-full relative transition-colors duration-200"
                    style={{ background: business?.allow_discounts ? 'var(--accent)' : 'var(--surface-3)' }}
                  >
                    <span className="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200" style={{ transform: business?.allow_discounts ? 'translateX(22px)' : 'translateX(2px)' }} />
                  </button>
                </div>
              </div>

              {/* AI test console */}
              <div className="rounded-[var(--r-xl)] p-5 space-y-3" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <div className="text-[14px] font-semibold text-[var(--text-1)]">Test AI Console</div>
                <div className="flex gap-2">
                  <input
                    value={testMessage}
                    onChange={e => setTestMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && testAI()}
                    placeholder="Type a test message…"
                    className="flex-1 px-3 py-2 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-3)] text-[var(--text-1)] outline-none"
                    style={{ border: '1px solid var(--border)' }}
                  />
                  <button
                    onClick={testAI}
                    disabled={testLoading || !testMessage}
                    className="px-4 py-2 rounded-[var(--r-md)] text-[13px] font-semibold transition-all duration-150 disabled:opacity-40"
                    style={{ background: 'var(--accent)', color: 'var(--void)' }}
                  >
                    <Send size={14} />
                  </button>
                </div>
                {testReply && (
                  <div
                    className="p-3 rounded-[var(--r-md)] text-[13px] text-[var(--text-1)] leading-relaxed"
                    style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}
                  >
                    <div className="text-[10px] font-semibold text-[var(--accent)] mb-1">AI</div>
                    {testReply}
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'payments' && (
            <div className="rounded-[var(--r-xl)] p-5 space-y-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
              <div className="text-[14px] font-semibold text-[var(--text-1)]">Payment Settings</div>
              <div
                className="p-3 rounded-[var(--r-md)] text-[12px] font-medium"
                style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}
              >
                Primary — Mobile Money
              </div>
              {[
                { key: 'momo_provider', label: 'MoMo Provider', placeholder: 'MTN or Airtel' },
                { key: 'momo_name', label: 'Registered Name', placeholder: 'Name on MoMo account' },
                { key: 'momo_number', label: 'MoMo Number', placeholder: '+256 7XX XXX XXX' },
                { key: 'payment_instructions', label: 'Payment Instructions', placeholder: 'Send payment to 07XX to name "John Doe"' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-[12px] uppercase tracking-wide text-[var(--text-3)] mb-1.5 block">{f.label}</label>
                  <input
                    defaultValue={business?.[f.key] ?? ''}
                    onBlur={e => save({ [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2.5 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-3)] text-[var(--text-1)] placeholder:text-[var(--text-3)] outline-none"
                    style={{ border: '1px solid var(--border)' }}
                  />
                </div>
              ))}
            </div>
          )}

          {tab === 'notifications' && (
            <div className="rounded-[var(--r-xl)] p-5 space-y-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
              <div className="text-[14px] font-semibold text-[var(--text-1)]">Notification Settings</div>
              <div>
                <label className="text-[12px] uppercase tracking-wide text-[var(--text-3)] mb-1.5 block">Alert Phone Number</label>
                <input
                  defaultValue={business?.notification_phone ?? ''}
                  onBlur={e => save({ notification_phone: e.target.value })}
                  placeholder="+256 7XX XXX XXX"
                  className="w-full px-3 py-2.5 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-3)] text-[var(--text-1)] placeholder:text-[var(--text-3)] outline-none"
                  style={{ border: '1px solid var(--border)' }}
                />
              </div>
              {[
                { key: 'notify_new_order', label: 'New Order', desc: 'WhatsApp alert for each new order' },
                { key: 'notify_new_message', label: 'New Message', desc: 'Alert when a customer messages' },
                { key: 'auto_reply', label: 'Auto Reply', desc: 'AI responds automatically' },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between">
                  <div>
                    <div className="text-[13px] font-medium text-[var(--text-1)]">{n.label}</div>
                    <div className="text-[12px] text-[var(--text-3)]">{n.desc}</div>
                  </div>
                  <button
                    onClick={() => save({ [n.key]: !business?.[n.key] })}
                    className="w-10 h-5 rounded-full relative transition-colors duration-200 shrink-0"
                    style={{ background: business?.[n.key] !== false ? 'var(--accent)' : 'var(--surface-3)' }}
                  >
                    <span className="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200" style={{ transform: business?.[n.key] !== false ? 'translateX(22px)' : 'translateX(2px)' }} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {saved && (
            <div className="flex items-center gap-2 text-[12px]" style={{ color: 'var(--success)' }}>
              <Save size={12} /> Saved
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
