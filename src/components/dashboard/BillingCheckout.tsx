'use client'

import { useState } from 'react'
import { Check, Zap } from 'lucide-react'

type PaymentStep = 'method' | 'phone' | 'pending' | 'success' | 'failed'

const PLANS = {
  starter: { usd: 19, ugx: 70000, label: 'Starter' },
  pro: { usd: 49, ugx: 180000, label: 'Pro' },
} as const

const PROVIDERS = [
  { id: 'mtn', label: 'MTN Mobile Money', color: '#FFCC00', dark: true },
  { id: 'airtel', label: 'Airtel Money', color: '#EF4444', dark: false },
  { id: 'card', label: 'Card (International)', color: '#3B82F6', dark: false },
]

interface BillingCheckoutProps {
  plan: 'starter' | 'pro'
  businessId: string
  onSuccess?: () => void
}

export function BillingCheckout({ plan, businessId, onSuccess }: BillingCheckoutProps) {
  const [step, setStep] = useState<PaymentStep>('method')
  const [phone, setPhone] = useState('')
  const [provider, setProvider] = useState('mtn')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const price = PLANS[plan]

  async function initiateMoMo() {
    if (!phone.trim()) return
    setProcessing(true)
    setError('')
    setStep('pending')

    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, paymentMethod: provider, phone, businessId }),
      })
      const data = await res.json()

      if (data.payment_url) {
        // Redirect flow (card)
        window.location.href = data.payment_url
        return
      }

      if (data.reference) {
        pollForConfirmation(data.reference)
      } else if (data.error) {
        setError(data.error)
        setStep('method')
      } else {
        // Demo mode
        setTimeout(() => { setStep('success'); onSuccess?.() }, 2000)
      }
    } catch {
      setError('Network error. Please try again.')
      setStep('method')
    } finally {
      setProcessing(false)
    }
  }

  function pollForConfirmation(reference: string) {
    let attempts = 0
    const interval = setInterval(async () => {
      attempts++
      if (attempts > 30) {
        clearInterval(interval)
        setStep('failed')
        return
      }
      try {
        const res = await fetch(`/api/billing/status?ref=${reference}`)
        const data = await res.json()
        if (data.status === 'COMPLETED' || data.status === 'completed') {
          clearInterval(interval)
          setStep('success')
          onSuccess?.()
        }
      } catch {}
    }, 3000)
  }

  if (step === 'method') return (
    <div className="space-y-5">
      <div>
        <div className="font-['Playfair_Display'] font-black text-[28px] leading-tight" style={{ color: 'var(--text-1)' }}>
          {price.label} Plan
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="font-['Playfair_Display'] font-black text-[40px]" style={{ color: 'var(--accent)' }}>${price.usd}</span>
          <span className="text-[14px]" style={{ color: 'var(--text-3)' }}>/month</span>
          <span className="text-[13px]" style={{ color: 'var(--text-3)' }}>(UGX {price.ugx.toLocaleString()})</span>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-[var(--r-md)] text-[13px]" style={{ background: 'var(--error-dim)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--error)' }}>
          {error}
        </div>
      )}

      <div className="space-y-2">
        {PROVIDERS.map(p => (
          <button
            key={p.id}
            onClick={() => { setProvider(p.id); setStep('phone') }}
            className="w-full flex items-center gap-3 px-4 py-4 rounded-[var(--r-lg)] text-left transition-all duration-150"
            style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', color: 'var(--text-1)' }}
            onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.98)' }}
            onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
          >
            <div className="w-4 h-4 rounded-full shrink-0" style={{ background: p.color }} />
            <span className="text-[14px] font-medium">{p.label}</span>
            <span className="ml-auto text-[12px]" style={{ color: 'var(--text-3)' }}>→</span>
          </button>
        ))}
      </div>

      {/* FTC disclosure */}
      <div
        className="px-4 py-3 rounded-[var(--r-md)] text-[12px] leading-relaxed"
        style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-3)' }}
      >
        After your 7-day free trial, you'll be charged ${price.usd}/month (UGX {price.ugx.toLocaleString()}) automatically until you cancel. Cancel anytime from Dashboard → Billing.
      </div>
    </div>
  )

  if (step === 'phone') return (
    <div className="space-y-5">
      <button onClick={() => setStep('method')} className="text-[13px]" style={{ color: 'var(--text-3)' }}>← Back</button>
      <div>
        <div className="font-['Playfair_Display'] font-black text-[22px]" style={{ color: 'var(--text-1)' }}>
          Enter your {provider === 'mtn' ? 'MTN' : provider === 'airtel' ? 'Airtel' : 'card'} number
        </div>
        <p className="text-[13px] mt-1" style={{ color: 'var(--text-3)' }}>
          {provider === 'card' ? 'You will be redirected to a secure payment page.' : 'You will receive a payment prompt on your phone. Approve it to activate your plan.'}
        </p>
      </div>
      <input
        autoFocus
        type="tel"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        placeholder={provider === 'card' ? 'Card number (on payment page)' : 'e.g. 0771234567'}
        className="w-full px-5 py-4 rounded-[var(--r-lg)] text-[15px] outline-none"
        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-1)' }}
        onKeyDown={e => e.key === 'Enter' && initiateMoMo()}
      />
      <button
        onClick={initiateMoMo}
        disabled={processing || (!phone.trim() && provider !== 'card')}
        className="w-full py-4 rounded-[var(--r-lg)] text-[15px] font-semibold transition-all duration-150 disabled:opacity-40"
        style={{ background: 'var(--accent)', color: 'var(--void)' }}
        onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)' }}
        onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
      >
        {processing ? 'Processing…' : `Pay UGX ${price.ugx.toLocaleString()} →`}
      </button>
    </div>
  )

  if (step === 'pending') return (
    <div className="py-12 text-center space-y-5">
      <div
        className="w-16 h-16 mx-auto rounded-full flex items-center justify-center animate-pulse"
        style={{ background: 'var(--accent-dim)', border: '2px solid var(--accent)' }}
      >
        <span style={{ fontSize: 28 }}>📱</span>
      </div>
      <div>
        <div className="font-['Playfair_Display'] font-black text-xl mb-2" style={{ color: 'var(--text-1)' }}>Check your phone</div>
        <p className="text-[14px]" style={{ color: 'var(--text-2)' }}>
          Approve the payment prompt on your {provider === 'mtn' ? 'MTN' : 'Airtel'} line.
          <br />This page updates automatically.
        </p>
      </div>
    </div>
  )

  if (step === 'success') return (
    <div className="py-12 text-center space-y-5">
      <div
        className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
        style={{ background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.3)' }}
      >
        <Check size={28} style={{ color: '#22C55E' }} />
      </div>
      <div>
        <div className="font-['Playfair_Display'] font-black text-2xl mb-2" style={{ color: 'var(--accent)' }}>You're live!</div>
        <p className="text-[14px]" style={{ color: 'var(--text-2)' }}>
          Your {price.label} plan is active. Your AI is running 24/7.
        </p>
      </div>
    </div>
  )

  if (step === 'failed') return (
    <div className="py-12 text-center space-y-5">
      <div className="text-5xl">❌</div>
      <div>
        <div className="text-[18px] font-semibold mb-2" style={{ color: 'var(--error)' }}>Payment timed out</div>
        <p className="text-[14px] mb-4" style={{ color: 'var(--text-2)' }}>The payment was not confirmed in time. Please try again.</p>
      </div>
      <button
        onClick={() => setStep('method')}
        className="px-6 py-3 rounded-[var(--r-lg)] text-[14px] font-semibold"
        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-1)' }}
      >
        Try again
      </button>
    </div>
  )

  return null
}
