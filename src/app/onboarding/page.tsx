'use client'

// Legacy export for backward compat with old step components (not used in new flow)
export type OnboardingData = {
  name: string; category: string; country: string; city: string;
  currency: 'USD' | 'UGX' | 'KES'; countryCode: string; phone: string; email: string;
  personality: 'professional' | 'friendly' | 'luxury'; autoReply: boolean;
  openTime: string; closeTime: string;
}

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BUSINESS_TYPES } from '@/lib/businessTypes'
import { generateSlug, generateReferralCode } from '@/lib/slug'
import { ChevronRight, ChevronLeft, Bot, Check, Zap } from 'lucide-react'
import { trackNewCustomer } from '@/lib/airtable'

const STEPS = [
  { id: 1, title: "What's your business called?", hint: "This is how your AI will introduce itself." },
  { id: 2, title: "What type of business?", hint: "Your AI learns from this to answer correctly." },
  { id: 3, title: "Where are you based?", hint: "For delivery zones and currency." },
  { id: 4, title: "Add your first product", hint: "Your AI needs to know what you sell." },
  { id: 5, title: "Watch your AI reply", hint: "This is exactly what your customers will see." },
  { id: 6, title: "Connect WhatsApp", hint: "One QR scan. AI activates immediately." },
  { id: 7, title: "Start your free trial", hint: "7 days free. No credit card required." },
]

const CURRENCIES = ['UGX', 'USD', 'KES', 'EUR', 'GBP']
const COUNTRIES = ['Uganda', 'Kenya', 'Tanzania', 'Rwanda', 'Ghana', 'Nigeria', 'South Africa', 'Other']

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(1)
  const [userId, setUserId] = useState<string | null>(null)
  const [data, setData] = useState<Record<string, any>>({
    businessName: '', businessType: '', country: 'Uganda', city: '',
    currency: 'UGX', productName: '', productPrice: '', personality: 'friendly',
  })
  const [completing, setCompleting] = useState(false)
  const [demoChat, setDemoChat] = useState<{ role: 'customer' | 'ai'; text: string }[]>([])
  const [demoTyping, setDemoTyping] = useState(false)
  const saveRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/sign-in'); return }
      setUserId(user.id)
      // Restore saved progress
      supabase.from('onboarding_progress').select('*').eq('user_id', user.id).single()
        .then(({ data: progress }) => {
          if (progress?.completed) { router.push('/dashboard'); return }
          if (progress) {
            setStep(Math.min(progress.step_completed + 1, 7))
            setData(prev => ({
              ...prev,
              businessName: progress.business_name ?? '',
              businessType: progress.business_type ?? '',
              country: progress.country ?? 'Uganda',
              city: progress.city ?? '',
              currency: progress.currency ?? 'UGX',
              productName: progress.product_name ?? '',
              productPrice: progress.product_price ?? '',
            }))
          }
        })
    })
  }, [])

  const saveProgress = useCallback(async (stepNum: number, patch: Record<string, any> = {}) => {
    if (!userId) return
    await supabase.from('onboarding_progress').upsert({
      user_id: userId,
      step_completed: stepNum,
      business_name: patch.businessName ?? data.businessName,
      business_type: patch.businessType ?? data.businessType,
      country: patch.country ?? data.country,
      city: patch.city ?? data.city,
      currency: patch.currency ?? data.currency,
      product_name: patch.productName ?? data.productName,
      product_price: patch.productPrice ?? data.productPrice,
      completed: false,
    }, { onConflict: 'user_id' })
  }, [userId, data])

  function updateData(patch: Record<string, any>) {
    setData(prev => ({ ...prev, ...patch }))
    if (saveRef.current) clearTimeout(saveRef.current)
    saveRef.current = setTimeout(() => saveProgress(step, patch), 800)
  }

  async function next(patch: Record<string, any> = {}) {
    const newData = { ...data, ...patch }
    setData(newData)
    await saveProgress(step, newData)
    if (step < 7) setStep(s => s + 1)
    else complete(newData)
  }

  function back() {
    setStep(s => Math.max(1, s - 1))
  }

  // Run demo AI when reaching step 5
  useEffect(() => {
    if (step !== 5) return
    const productName = data.productName || 'your products'
    const price = data.productPrice ? ` for ${data.currency} ${data.productPrice}` : ''
    setDemoChat([{ role: 'customer', text: `Hi! Do you have ${productName}? How much is it?` }])
    setDemoTyping(true)
    setTimeout(() => {
      setDemoTyping(false)
      setDemoChat(prev => [...prev, {
        role: 'ai',
        text: `Hi! Yes, we have ${productName}${price}. Would you like to place an order? I can help you right away! 😊`,
      }])
    }, 1800)
  }, [step])

  async function complete(finalData: Record<string, any>) {
    if (!userId) return
    setCompleting(true)
    const slug = generateSlug(finalData.businessName)
    const referral_code = generateReferralCode(finalData.businessName)

    await supabase.from('businesses').insert({
      user_id: userId,
      name: finalData.businessName,
      business_type: finalData.businessType,
      country: finalData.country,
      city: finalData.city,
      currency: finalData.currency,
      slug, referral_code,
      ai_personality: finalData.personality,
      auto_reply: true,
      is_active: true,
      plan: 'trial',
      plan_expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
    })

    // Add first product if provided
    if (finalData.productName && finalData.productPrice) {
      const { data: biz } = await supabase.from('businesses').select('id').eq('user_id', userId).single()
      if (biz) {
        await supabase.from('products').insert({
          business_id: biz.id,
          name: finalData.productName,
          price: Number(finalData.productPrice),
          is_active: true,
        })
      }
    }

    await supabase.from('onboarding_progress').update({ completed: true, completed_at: new Date().toISOString() }).eq('user_id', userId)

    // Track new customer in Airtable (non-blocking)
    const { data: { user: authUser } } = await supabase.auth.getUser()
    trackNewCustomer({
      businessName: finalData.businessName,
      ownerName: authUser?.user_metadata?.full_name ?? authUser?.user_metadata?.name,
      email: authUser?.email,
      country: finalData.country ?? '',
      city: finalData.city ?? '',
      businessType: finalData.businessType ?? '',
      referralCode: referral_code,
    })

    router.push('/dashboard/connect')
  }

  const progress = ((step - 1) / 6) * 100
  const canNext = step === 1 ? !!data.businessName.trim()
    : step === 2 ? !!data.businessType
    : step === 3 ? !!data.city.trim()
    : true

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start py-12 px-6"
      style={{ background: 'var(--void)', fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Progress bar */}
      <div className="w-full max-w-lg mb-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px]" style={{ color: 'var(--text-3)' }}>Step {step} of {STEPS.length}</span>
          <span className="text-[12px]" style={{ color: 'var(--text-3)' }}>{STEPS[step - 1].hint}</span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--surface-3)' }}>
          <div
            className="h-1 rounded-full"
            style={{ width: `${progress}%`, background: 'var(--accent)', transition: 'width 400ms var(--ease)' }}
          />
        </div>
        <div className="flex justify-between mt-2">
          {STEPS.map(s => (
            <div
              key={s.id}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{ background: s.id <= step ? 'var(--accent)' : 'var(--surface-3)' }}
            />
          ))}
        </div>
      </div>

      {/* Step content */}
      <div
        key={step}
        className="w-full max-w-lg animate-[fadeUp_250ms_var(--ease)_both]"
      >
        <h1
          className="font-['Playfair_Display'] font-black mb-8"
          style={{ fontSize: 'clamp(28px,4vw,38px)', color: 'var(--text-1)', lineHeight: 1.1, letterSpacing: '-0.03em' }}
        >
          {STEPS[step - 1].title}
        </h1>

        {/* Step 1 — Business name */}
        {step === 1 && (
          <div className="space-y-4">
            <input
              autoFocus
              value={data.businessName}
              onChange={e => updateData({ businessName: e.target.value })}
              placeholder="e.g. Amara's Boutique"
              className="w-full px-5 py-4 rounded-[var(--r-lg)] text-[16px] font-medium outline-none transition-colors duration-150"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-1)' }}
              onKeyDown={e => e.key === 'Enter' && canNext && next()}
            />
          </div>
        )}

        {/* Step 2 — Business type */}
        {step === 2 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {BUSINESS_TYPES.map(bt => (
              <button
                key={bt.id}
                onClick={() => next({ businessType: bt.id })}
                className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-[var(--r-lg)] text-center transition-all duration-150"
                style={{
                  background: data.businessType === bt.id ? 'var(--accent-dim)' : 'var(--surface-2)',
                  border: `1px solid ${data.businessType === bt.id ? 'var(--accent-border)' : 'var(--border)'}`,
                }}
                onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.96)' }}
                onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
              >
                <span style={{ fontSize: 22 }}>{bt.icon}</span>
                <span className="text-[11px] font-medium leading-tight" style={{ color: 'var(--text-2)' }}>{bt.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Step 3 — Location */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="text-[12px] uppercase tracking-wide mb-1.5 block" style={{ color: 'var(--text-3)' }}>Country</label>
              <select
                value={data.country}
                onChange={e => updateData({ country: e.target.value })}
                className="w-full px-5 py-4 rounded-[var(--r-lg)] text-[15px] outline-none"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-1)' }}
              >
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] uppercase tracking-wide mb-1.5 block" style={{ color: 'var(--text-3)' }}>City</label>
              <input
                autoFocus
                value={data.city}
                onChange={e => updateData({ city: e.target.value })}
                placeholder="e.g. Kampala"
                className="w-full px-5 py-4 rounded-[var(--r-lg)] text-[15px] outline-none"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-1)' }}
                onKeyDown={e => e.key === 'Enter' && canNext && next()}
              />
            </div>
            <div>
              <label className="text-[12px] uppercase tracking-wide mb-1.5 block" style={{ color: 'var(--text-3)' }}>Currency</label>
              <div className="flex gap-2 flex-wrap">
                {CURRENCIES.map(c => (
                  <button
                    key={c}
                    onClick={() => updateData({ currency: c })}
                    className="px-4 py-2 rounded-[var(--r-md)] text-[13px] font-semibold transition-all duration-150"
                    style={{
                      background: data.currency === c ? 'var(--accent)' : 'var(--surface-2)',
                      color: data.currency === c ? 'var(--void)' : 'var(--text-2)',
                      border: `1px solid ${data.currency === c ? 'var(--accent)' : 'var(--border)'}`,
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4 — First product */}
        {step === 4 && (
          <div className="space-y-4">
            <div
              className="px-4 py-3 rounded-[var(--r-md)] text-[13px]"
              style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}
            >
              Your AI uses this to answer "do you have X?" and "how much?" questions.
            </div>
            <div>
              <label className="text-[12px] uppercase tracking-wide mb-1.5 block" style={{ color: 'var(--text-3)' }}>Product or service name</label>
              <input
                autoFocus
                value={data.productName}
                onChange={e => updateData({ productName: e.target.value })}
                placeholder="e.g. Ankara Dress"
                className="w-full px-5 py-4 rounded-[var(--r-lg)] text-[15px] outline-none"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-1)' }}
              />
            </div>
            <div>
              <label className="text-[12px] uppercase tracking-wide mb-1.5 block" style={{ color: 'var(--text-3)' }}>Price ({data.currency})</label>
              <input
                type="number"
                value={data.productPrice}
                onChange={e => updateData({ productPrice: e.target.value })}
                placeholder="e.g. 45000"
                className="w-full px-5 py-4 rounded-[var(--r-lg)] text-[15px] outline-none"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-1)' }}
              />
            </div>
            <button
              onClick={() => next()}
              className="text-[13px] text-right w-full"
              style={{ color: 'var(--text-3)' }}
            >
              Skip for now →
            </button>
          </div>
        )}

        {/* Step 5 — AI demo */}
        {step === 5 && (
          <div className="space-y-4">
            <div
              className="rounded-[var(--r-xl)] p-5 space-y-3"
              style={{ background: '#128C7E', minHeight: 180 }}
            >
              <div className="text-[11px] font-semibold text-white/60 mb-2">WhatsApp Preview</div>
              {demoChat.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                  <div
                    className="max-w-[85%] px-3 py-2 rounded-[4px_16px_16px_16px] text-[13px] leading-relaxed"
                    style={{
                      background: msg.role === 'ai' ? '#fff' : '#DCF8C6',
                      color: '#111',
                      borderRadius: msg.role === 'customer' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                    }}
                  >
                    {msg.role === 'ai' && (
                      <div className="text-[10px] font-bold mb-0.5" style={{ color: '#128C7E' }}>
                        {data.businessName || 'Your Business'} AI
                      </div>
                    )}
                    {msg.text}
                  </div>
                </div>
              ))}
              {demoTyping && (
                <div className="flex gap-1.5 px-3 py-2 w-fit rounded-[4px_16px_16px_16px] bg-white">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-gray-400"
                      style={{ animation: `dot-bounce 1.2s ${i * 0.2}s infinite` }}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="text-[14px] text-center" style={{ color: 'var(--text-2)' }}>
              <span style={{ color: 'var(--accent)' }}>This</span> is what your customers see — every time, automatically.
            </div>
          </div>
        )}

        {/* Step 6 — Connect WhatsApp (info step) */}
        {step === 6 && (
          <div className="space-y-5">
            <div
              className="rounded-[var(--r-xl)] p-6 text-center"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
            >
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-[16px] font-semibold mb-2" style={{ color: 'var(--text-1)' }}>
                Connect in the dashboard
              </h3>
              <p className="text-[14px] leading-relaxed" style={{ color: 'var(--text-2)' }}>
                After setup, you'll scan a QR code with WhatsApp.<br />
                Takes 30 seconds. Your AI activates immediately.
              </p>
            </div>
            <div className="space-y-3">
              {['Open WhatsApp on your phone', 'Tap ⋮ → Linked Devices → Link a Device', 'Scan the QR code in your dashboard', 'AI is live in seconds'].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                    style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}
                  >
                    {i + 1}
                  </div>
                  <span className="text-[13px]" style={{ color: 'var(--text-2)' }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 7 — Free trial */}
        {step === 7 && (
          <div className="space-y-6">
            <div
              className="rounded-[var(--r-xl)] p-6"
              style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Zap size={20} style={{ color: 'var(--accent)' }} />
                <span className="font-['Playfair_Display'] font-black text-xl" style={{ color: 'var(--accent)' }}>
                  7 Days Free — Full Pro Access
                </span>
              </div>
              {[
                'WhatsApp AI replies to every customer 24/7',
                'Online store at getorda.app/store/' + generateSlug(data.businessName || 'your-business'),
                'Payment screenshot verification',
                'Voice note transcription',
                'Order tracking & PDF invoices',
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2.5 mb-2">
                  <Check size={14} style={{ color: 'var(--success)', flexShrink: 0 }} />
                  <span className="text-[13px]" style={{ color: 'var(--text-2)' }}>{f}</span>
                </div>
              ))}
            </div>

            {/* FTC disclosure */}
            <div
              className="px-4 py-3 rounded-[var(--r-md)] text-[12px] leading-relaxed"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-3)' }}
            >
              After your 7-day free trial, your plan renews automatically at $19/month (UGX 70,000). Cancel anytime from Dashboard → Billing — no questions asked. No credit card required to start.
            </div>

            <button
              onClick={() => complete(data)}
              disabled={completing}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-[var(--r-lg)] text-[15px] font-semibold transition-all duration-150 disabled:opacity-50"
              style={{ background: 'var(--accent)', color: 'var(--void)' }}
              onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)' }}
              onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
            >
              {completing ? (
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>Activate Free Trial — No Card Required <ChevronRight size={16} /></>
              )}
            </button>
          </div>
        )}

        {/* Navigation */}
        {step !== 2 && step !== 7 && (
          <div className="flex items-center justify-between mt-8">
            {step > 1 ? (
              <button
                onClick={back}
                className="flex items-center gap-1.5 text-[13px] transition-colors duration-150"
                style={{ color: 'var(--text-3)' }}
              >
                <ChevronLeft size={14} /> Back
              </button>
            ) : <div />}

            <button
              onClick={() => next()}
              disabled={!canNext || completing}
              className="flex items-center gap-1.5 px-6 py-3 rounded-[var(--r-lg)] text-[14px] font-semibold transition-all duration-150 disabled:opacity-40"
              style={{ background: 'var(--accent)', color: 'var(--void)' }}
              onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)' }}
              onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
            >
              {step === 6 ? 'Go to Dashboard' : 'Continue'} <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
