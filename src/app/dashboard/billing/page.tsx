'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, Crown, Zap, AlertTriangle } from 'lucide-react'
import { BillingCheckout } from '@/components/dashboard/BillingCheckout'

const PLANS = [
  {
    id: 'starter' as const,
    name: 'Starter',
    usd: 19,
    ugx: 70000,
    features: ['WhatsApp AI Agent', 'Online Store', 'Order Tracking', 'PDF Invoices', 'Up to 5 staff', '500 messages/day'],
  },
  {
    id: 'pro' as const,
    name: 'Pro',
    usd: 49,
    ugx: 180000,
    recommended: true,
    features: ['Everything in Starter', 'AI Website Builder', 'Unlimited messages', 'Unlimited staff', 'Analytics', 'Priority support'],
  },
]

export default function BillingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [business, setBusiness] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro'>('pro')
  const [showCheckout, setShowCheckout] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [cancelConfirm, setCancelConfirm] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/sign-in'); return }
      supabase.from('businesses').select('id, plan, plan_expires_at, name, currency')
        .eq('user_id', user.id).single()
        .then(({ data }) => { if (data) setBusiness(data); setLoading(false) })
    })
  }, [])

  const planExpiry = business?.plan_expires_at ? new Date(business.plan_expires_at) : null
  const daysLeft = planExpiry ? Math.max(0, Math.ceil((planExpiry.getTime() - Date.now()) / 86400000)) : null
  const isTrial = business?.plan === 'trial'
  const isActive = business?.plan === 'starter' || business?.plan === 'pro'

  async function cancelSubscription() {
    if (!business) return
    setCancelling(true)
    await fetch('/api/billing/cancel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ businessId: business.id }) })
    setBusiness((b: any) => ({ ...b, plan: 'cancelled' }))
    setCancelling(false)
    setCancelConfirm(false)
  }

  if (loading) return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <div className="h-12 w-32 skeleton rounded" />
      <div className="h-32 skeleton rounded-[var(--r-xl)]" />
    </div>
  )

  if (showCheckout && business) return (
    <div className="p-6 max-w-lg mx-auto">
      <button onClick={() => setShowCheckout(false)} className="text-[13px] mb-6" style={{ color: 'var(--text-3)' }}>← Back to Billing</button>
      <BillingCheckout
        plan={selectedPlan}
        businessId={business.id}
        onSuccess={() => {
          setShowCheckout(false)
          supabase.from('businesses').select('plan, plan_expires_at').eq('id', business.id).single()
            .then(({ data }) => { if (data) setBusiness((b: any) => ({ ...b, ...data })) })
        }}
      />
    </div>
  )

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-['Playfair_Display'] font-black text-2xl text-[var(--text-1)]">Billing</h1>
        <p className="text-[13px] text-[var(--text-3)] mt-1">Manage your subscription</p>
      </div>

      {/* Current plan */}
      {business && (
        <div
          className="rounded-[var(--r-xl)] p-5"
          style={{
            background: isTrial ? 'rgba(212,168,83,0.06)' : isActive ? 'rgba(34,197,94,0.06)' : 'var(--surface-2)',
            border: `1px solid ${isTrial ? 'var(--accent-border)' : isActive ? 'rgba(34,197,94,0.2)' : 'var(--border)'}`,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[12px] uppercase tracking-wide text-[var(--text-3)] mb-1">Current Plan</div>
              <div className="font-['Playfair_Display'] font-black text-xl text-[var(--text-1)] capitalize">{business.plan}</div>
              {daysLeft !== null && (
                <div className="text-[13px] mt-1" style={{ color: daysLeft < 3 ? 'var(--error)' : 'var(--text-2)' }}>
                  {isTrial ? `Trial ends in ${daysLeft} day${daysLeft === 1 ? '' : 's'}` : `Renews in ${daysLeft} days`}
                </div>
              )}
            </div>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: isTrial ? 'var(--accent-dim)' : 'var(--success-dim)', color: isTrial ? 'var(--accent)' : 'var(--success)' }}
            >
              {isTrial ? <Zap size={20} /> : <CheckCircle size={20} />}
            </div>
          </div>
        </div>
      )}

      {/* Plan selection */}
      <div>
        <div className="text-[14px] font-semibold text-[var(--text-1)] mb-3">Choose a Plan</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PLANS.map(plan => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className="relative rounded-[var(--r-xl)] p-5 text-left transition-all duration-150"
              style={{
                background: selectedPlan === plan.id ? 'var(--accent-dim)' : 'var(--surface-2)',
                border: `1px solid ${selectedPlan === plan.id ? 'var(--accent)' : 'var(--border)'}`,
              }}
              onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)' }}
              onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
            >
              {plan.recommended && (
                <div className="absolute -top-2.5 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'var(--accent)', color: 'var(--void)' }}>
                  RECOMMENDED
                </div>
              )}
              <div className="flex items-center gap-2 mb-2">
                <Crown size={16} style={{ color: 'var(--accent)' }} />
                <span className="text-[15px] font-bold text-[var(--text-1)]">{plan.name}</span>
              </div>
              <div className="font-['Playfair_Display'] font-black text-2xl text-[var(--text-1)]">
                ${plan.usd}<span className="text-[14px] font-medium text-[var(--text-3)]">/mo</span>
              </div>
              <div className="text-[12px] text-[var(--text-3)] mb-3">UGX {plan.ugx.toLocaleString()}/mo</div>
              <ul className="space-y-1.5">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-[12px] text-[var(--text-2)]">
                    <CheckCircle size={12} style={{ color: 'var(--success)', flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-3 text-[11px] text-[var(--text-3)]">7-day free trial included</div>
            </button>
          ))}
        </div>
      </div>

      {/* FTC-required auto-renewal disclosure — MUST be on same screen as button */}
      <div
        className="px-4 py-4 rounded-[var(--r-lg)] space-y-1"
        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-start gap-2">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" style={{ color: 'var(--warning)' }} />
          <div className="text-[13px] leading-relaxed" style={{ color: 'var(--text-2)' }}>
            After your 7-day free trial, you will be charged <strong style={{ color: 'var(--text-1)' }}>${PLANS.find(p => p.id === selectedPlan)?.usd}/month (UGX {PLANS.find(p => p.id === selectedPlan)?.ugx.toLocaleString()})</strong> automatically until you cancel.
            Cancel anytime from <strong style={{ color: 'var(--text-1)' }}>Dashboard → Billing → Cancel Subscription</strong> — no questions asked.
            No credit card required to start your trial.
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowCheckout(true)}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-[var(--r-lg)] text-[14px] font-semibold transition-all duration-150"
        style={{ background: 'var(--accent)', color: 'var(--void)' }}
        onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)' }}
        onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
      >
        Start {selectedPlan === 'pro' ? 'Pro' : 'Starter'} — 7 Days Free →
      </button>

      {/* Cancel subscription (FTC: one-click, no friction) */}
      {isActive && (
        <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          {!cancelConfirm ? (
            <button
              onClick={() => setCancelConfirm(true)}
              className="text-[13px] transition-colors duration-150"
              style={{ color: 'var(--text-3)' }}
            >
              Cancel subscription
            </button>
          ) : (
            <div
              className="p-4 rounded-[var(--r-lg)] space-y-3"
              style={{ background: 'var(--error-dim)', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              <div className="text-[13px]" style={{ color: 'var(--text-1)' }}>
                Your subscription will end on {planExpiry?.toLocaleDateString('en-UG', { day: 'numeric', month: 'long', year: 'numeric' })}. You'll retain full access until then.
              </div>
              <div className="flex gap-3">
                <button
                  onClick={cancelSubscription}
                  disabled={cancelling}
                  className="px-4 py-2 rounded-[var(--r-md)] text-[13px] font-semibold transition-all duration-150 disabled:opacity-50"
                  style={{ background: 'var(--error)', color: '#fff' }}
                >
                  {cancelling ? 'Cancelling…' : 'Yes, cancel my subscription'}
                </button>
                <button
                  onClick={() => setCancelConfirm(false)}
                  className="px-4 py-2 rounded-[var(--r-md)] text-[13px] font-medium"
                  style={{ background: 'var(--surface-3)', color: 'var(--text-2)' }}
                >
                  Keep my subscription
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
