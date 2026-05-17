'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// ── Country list ────────────────────────────────────────────────────────────
const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Angola','Argentina','Armenia','Australia',
  'Austria','Azerbaijan','Bahrain','Bangladesh','Belarus','Belgium','Bolivia',
  'Bosnia and Herzegovina','Brazil','Bulgaria','Cambodia','Cameroon','Canada',
  'Chile','China','Colombia','Congo','Costa Rica','Croatia','Cuba','Czech Republic',
  'Denmark','Dominican Republic','Ecuador','Egypt','El Salvador','Estonia',
  'Ethiopia','Finland','France','Georgia','Germany','Ghana','Greece','Guatemala',
  'Honduras','Hungary','India','Indonesia','Iraq','Ireland','Israel','Italy',
  'Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kuwait','Kyrgyzstan','Latvia',
  'Lebanon','Libya','Lithuania','Luxembourg','Malaysia','Mexico','Moldova',
  'Morocco','Mozambique','Myanmar','Nepal','Netherlands','New Zealand','Nicaragua',
  'Nigeria','North Korea','Norway','Oman','Pakistan','Panama','Paraguay','Peru',
  'Philippines','Poland','Portugal','Qatar','Romania','Russia','Rwanda',
  'Saudi Arabia','Senegal','Serbia','Singapore','Slovakia','Slovenia',
  'South Africa','South Korea','Spain','Sri Lanka','Sudan','Sweden','Switzerland',
  'Syria','Taiwan','Tajikistan','Tanzania','Thailand','Tunisia','Turkey',
  'Turkmenistan','Uganda','Ukraine','United Arab Emirates','United Kingdom',
  'United States','Uruguay','Uzbekistan','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe',
]

// ── Country codes ───────────────────────────────────────────────────────────
const COUNTRY_CODES = [
  { code: '+1', label: 'US/CA' }, { code: '+44', label: 'UK' },
  { code: '+256', label: 'UG' }, { code: '+254', label: 'KE' },
  { code: '+255', label: 'TZ' }, { code: '+250', label: 'RW' },
  { code: '+233', label: 'GH' }, { code: '+234', label: 'NG' },
  { code: '+27', label: 'ZA' }, { code: '+49', label: 'DE' },
  { code: '+33', label: 'FR' }, { code: '+91', label: 'IN' },
  { code: '+86', label: 'CN' }, { code: '+971', label: 'AE' },
  { code: '+92', label: 'PK' }, { code: '+62', label: 'ID' },
  { code: '+55', label: 'BR' }, { code: '+52', label: 'MX' },
  { code: '+7', label: 'RU' }, { code: '+20', label: 'EG' },
]

// ── Types ───────────────────────────────────────────────────────────────────
type Platform = 'whatsapp' | 'instagram' | 'tiktok' | 'facebook'
type PlanId = 'starter' | 'growth' | 'premium'

interface Step1 { businessName: string; countryCode: string; phone: string; country: string; city: string }
interface Step1Errors { businessName?: string; phone?: string; country?: string; city?: string }

// ── Shared styles ───────────────────────────────────────────────────────────
const inputStyle = (error?: string): React.CSSProperties => ({
  width: '100%', background: '#111111', color: '#E4F0F6', fontSize: 14,
  padding: '12px 16px', borderRadius: 10, outline: 'none', boxSizing: 'border-box',
  border: `1px solid ${error ? '#ef4444' : '#1a2400'}`, transition: 'border-color 0.2s',
})

const labelStyle: React.CSSProperties = {
  display: 'block', color: '#8892A4', fontSize: 11, textTransform: 'uppercase',
  letterSpacing: '0.1em', marginBottom: 6, fontWeight: 500,
}

const btnPrimary: React.CSSProperties = {
  background: 'linear-gradient(135deg, #8729A0, #6a1f80)', color: 'white',
  borderRadius: 10, padding: '13px 28px', fontWeight: 600, fontSize: 15,
  border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
  justifyContent: 'center', gap: 8,
}

// ── Step Progress Indicator ─────────────────────────────────────────────────
function StepIndicator({ current }: { current: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 40 }}>
      {[1, 2, 3].map((step, i) => (
        <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: 700, fontSize: 14, transition: 'all 0.3s',
            background: step < current ? '#8729A0' : step === current ? '#8729A0' : 'transparent',
            border: step <= current ? '2px solid #8729A0' : '2px solid #1a2400',
            color: step <= current ? 'white' : '#8892A4',
          }}>
            {step < current ? <Check size={16} /> : step}
          </div>
          {i < 2 && (
            <div style={{ width: 64, height: 2, background: step < current ? '#8729A0' : '#1a2400', transition: 'background 0.3s' }} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Spinner ─────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 0.7s linear infinite' }}>
      <path d="M21 12a9 9 0 11-6.219-8.56" />
    </svg>
  )
}

// ── Step 1 ──────────────────────────────────────────────────────────────────
function Step1Form({ onNext }: { onNext: (data: Step1) => void }) {
  const [data, setData] = useState<Step1>({ businessName: '', countryCode: '+256', phone: '', country: 'Uganda', city: '' })
  const [errors, setErrors] = useState<Step1Errors>({})
  const [countrySearch, setCountrySearch] = useState('Uganda')
  const [showCountryDrop, setShowCountryDrop] = useState(false)

  const set = (field: keyof Step1) => (v: string) => setData(p => ({ ...p, [field]: v }))

  const validate = () => {
    const e: Step1Errors = {}
    if (data.businessName.trim().length < 2) e.businessName = 'Business name is required'
    if (!data.phone.trim()) e.phone = 'Phone number is required'
    if (!data.country) e.country = 'Country is required'
    if (!data.city.trim()) e.city = 'City is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const filteredCountries = COUNTRIES.filter(c =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  )

  return (
    <div>
      <h2 style={{ color: '#E4F0F6', fontSize: 22, fontWeight: 700, margin: '0 0 8px', fontFamily: 'Space Grotesk, sans-serif' }}>
        Tell us about your business
      </h2>
      <p style={{ color: '#8892A4', fontSize: 14, marginBottom: 28 }}>Let&apos;s set up your account.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label style={labelStyle}>Business Name</label>
          <input
            type="text" value={data.businessName} placeholder="Acme Store"
            onChange={e => set('businessName')(e.target.value)}
            style={inputStyle(errors.businessName)}
          />
          {errors.businessName && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4, marginBottom: 0 }}>{errors.businessName}</p>}
        </div>

        <div>
          <label style={labelStyle}>Phone Number</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <select
              value={data.countryCode}
              onChange={e => set('countryCode')(e.target.value)}
              style={{ background: '#111111', color: '#E4F0F6', border: '1px solid #1a2400', borderRadius: 10, padding: '12px 10px', fontSize: 13, outline: 'none', flexShrink: 0 }}
            >
              {COUNTRY_CODES.map(c => (
                <option key={c.code} value={c.code}>{c.code} {c.label}</option>
              ))}
            </select>
            <div style={{ flex: 1 }}>
              <input
                type="tel" value={data.phone} placeholder="700 123 456"
                onChange={e => set('phone')(e.target.value)}
                style={inputStyle(errors.phone)}
              />
            </div>
          </div>
          {errors.phone && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4, marginBottom: 0 }}>{errors.phone}</p>}
        </div>

        <div style={{ position: 'relative' }}>
          <label style={labelStyle}>Country</label>
          <input
            type="text"
            value={countrySearch}
            placeholder="Search country…"
            onChange={e => { setCountrySearch(e.target.value); setShowCountryDrop(true) }}
            onFocus={() => setShowCountryDrop(true)}
            style={inputStyle(errors.country)}
          />
          {showCountryDrop && filteredCountries.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
              background: '#111111', border: '1px solid #1a2400', borderRadius: 10,
              maxHeight: 200, overflowY: 'auto', marginTop: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            }}>
              {filteredCountries.map(c => (
                <div
                  key={c}
                  onClick={() => { set('country')(c); setCountrySearch(c); setShowCountryDrop(false) }}
                  style={{ padding: '10px 16px', cursor: 'pointer', color: '#E4F0F6', fontSize: 14, borderBottom: '1px solid #1a2400' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#1a2400')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {c}
                </div>
              ))}
            </div>
          )}
          {errors.country && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4, marginBottom: 0 }}>{errors.country}</p>}
        </div>

        <div>
          <label style={labelStyle}>City</label>
          <input
            type="text" value={data.city} placeholder="Kampala"
            onChange={e => set('city')(e.target.value)}
            style={inputStyle(errors.city)}
          />
          {errors.city && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4, marginBottom: 0 }}>{errors.city}</p>}
        </div>

        <button
          style={{ ...btnPrimary, marginTop: 8, width: '100%' }}
          onClick={() => { if (validate()) onNext(data) }}
        >
          Continue →
        </button>
      </div>
    </div>
  )
}

// ── Step 2 ──────────────────────────────────────────────────────────────────
const PLATFORM_INFO: { id: Platform; label: string; desc: string; color: string; icon: React.ReactNode }[] = [
  {
    id: 'whatsapp', label: 'WhatsApp', color: '#25D366',
    desc: 'Reply to WhatsApp messages automatically',
    icon: (
      <svg width="28" height="28" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="22" fill="#25D366"/>
        <path d="M31.3 12.7A13.1 13.1 0 0022 9C15 9 9.3 14.7 9.3 21.7a12.6 12.6 0 001.8 6.5L9 35l7-1.8a13 13 0 006 1.5c7 0 12.7-5.7 12.7-12.7 0-3.4-1.3-6.6-3.4-8.8z" fill="white"/>
      </svg>
    ),
  },
  {
    id: 'instagram', label: 'Instagram', color: '#C13584',
    desc: 'Handle DMs and story replies',
    icon: (
      <svg width="28" height="28" viewBox="0 0 44 44" fill="none">
        <defs>
          <radialGradient id="ob-ig" cx="26%" cy="110%" r="130%">
            <stop offset="0%" stopColor="#FDF497"/><stop offset="44%" stopColor="#FD5949"/>
            <stop offset="68%" stopColor="#D6249F"/><stop offset="100%" stopColor="#285AEB"/>
          </radialGradient>
        </defs>
        <rect width="44" height="44" rx="12" fill="url(#ob-ig)"/>
        <rect x="10" y="10" width="24" height="24" rx="7" stroke="white" strokeWidth="2.5"/>
        <circle cx="22" cy="22" r="6" stroke="white" strokeWidth="2.5"/>
        <circle cx="30.5" cy="13.5" r="2" fill="white"/>
      </svg>
    ),
  },
  {
    id: 'tiktok', label: 'TikTok', color: '#FE2C55',
    desc: 'Convert comments and DMs into sales',
    icon: (
      <svg width="28" height="28" viewBox="0 0 44 44" fill="none">
        <rect width="44" height="44" rx="12" fill="#010101"/>
        <path d="M28 10a6 6 0 004 3.5v4a10 10 0 01-6-2v9a7 7 0 11-7-7h1v4a3 3 0 103 3V10h5z" fill="white"/>
      </svg>
    ),
  },
  {
    id: 'facebook', label: 'Facebook', color: '#1877F2',
    desc: 'Manage page messages and leads',
    icon: (
      <svg width="28" height="28" viewBox="0 0 44 44" fill="none">
        <rect width="44" height="44" rx="12" fill="#1877F2"/>
        <path d="M28 8h-4a6 6 0 00-6 6v3h-3v5h3v12h5V22h4l1-5h-5v-3a1 1 0 011-1h4V8z" fill="white"/>
      </svg>
    ),
  },
]

function Step2Form({ onNext, onBack }: { onNext: (data: Set<Platform>) => void; onBack: () => void }) {
  const [selected, setSelected] = useState<Set<Platform>>(new Set())
  const [error, setError] = useState('')

  const toggle = (id: Platform) => {
    setSelected(prev => {
      const s = new Set(prev)
      if (s.has(id)) { s.delete(id) } else { s.add(id) }
      return s
    })
    setError('')
  }

  return (
    <div>
      <h2 style={{ color: '#E4F0F6', fontSize: 22, fontWeight: 700, margin: '0 0 8px', fontFamily: 'Space Grotesk, sans-serif' }}>
        Which platforms do you use?
      </h2>
      <p style={{ color: '#8892A4', fontSize: 14, marginBottom: 28 }}>
        Select all that apply. You can connect more later.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {PLATFORM_INFO.map(p => {
          const isSelected = selected.has(p.id)
          return (
            <div
              key={p.id}
              onClick={() => toggle(p.id)}
              style={{
                background: isSelected ? '#8729A010' : '#0A1200',
                border: `1px solid ${isSelected ? '#8729A0' : '#1a2400'}`,
                borderRadius: 12, padding: 20, cursor: 'pointer',
                position: 'relative', transition: 'all 0.2s',
              }}
            >
              {isSelected && (
                <div style={{ position: 'absolute', top: 10, right: 10, width: 20, height: 20, borderRadius: '50%', background: '#8729A0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={12} color="white" />
                </div>
              )}
              <div style={{ marginBottom: 10 }}>{p.icon}</div>
              <div style={{ color: '#E4F0F6', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{p.label}</div>
              <div style={{ color: '#8892A4', fontSize: 12, lineHeight: 1.4 }}>{p.desc}</div>
            </div>
          )
        })}
      </div>

      {error && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 12, marginBottom: 0 }}>{error}</p>}

      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <button
          onClick={onBack}
          style={{ flex: 1, background: 'transparent', color: '#8892A4', borderRadius: 10, padding: '13px 0', fontWeight: 600, fontSize: 15, border: '1px solid #1a2400', cursor: 'pointer' }}
        >
          ← Back
        </button>
        <button
          style={{ ...btnPrimary, flex: 2 }}
          onClick={() => {
            if (selected.size === 0) { setError('Please select at least one platform'); return }
            onNext(selected)
          }}
        >
          Continue →
        </button>
      </div>
    </div>
  )
}

// ── Step 3 ──────────────────────────────────────────────────────────────────
const PLANS: { id: PlanId; name: string; price: string; features: string[]; popular?: boolean }[] = [
  {
    id: 'starter', name: 'Starter', price: '$29/mo',
    features: ['1,000 messages/month', 'WhatsApp + 1 platform', 'Basic AI replies', 'Customer profiles', 'Email support'],
  },
  {
    id: 'growth', name: 'Growth', price: '$59/mo', popular: true,
    features: ['5,000 messages/month', 'All platforms', 'Advanced AI + voice messages', 'Broadcast campaigns', 'Payment collection', 'Weekly reports', 'Priority support'],
  },
  {
    id: 'premium', name: 'Premium', price: '$99/mo',
    features: ['Unlimited messages', 'Everything in Growth', 'Custom AI personality', 'Delivery management', 'Dedicated account manager'],
  },
]

function Step3Form({
  onSubmit,
  onBack,
  loading,
  error,
}: {
  onSubmit: (plan: PlanId) => void
  onBack: () => void
  loading: boolean
  error: string
}) {
  const [selected, setSelected] = useState<PlanId>('growth')

  return (
    <div>
      <h2 style={{ color: '#E4F0F6', fontSize: 22, fontWeight: 700, margin: '0 0 8px', fontFamily: 'Space Grotesk, sans-serif' }}>
        Choose your plan
      </h2>
      <p style={{ color: '#8892A4', fontSize: 14, marginBottom: 28 }}>
        Start free for 7 days. Cancel anytime.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {PLANS.map(plan => {
          const isSelected = selected === plan.id
          return (
            <div
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              style={{
                background: isSelected ? '#8729A008' : '#0A1200',
                border: `1px solid ${isSelected ? '#8729A0' : '#1a2400'}`,
                borderRadius: 12, padding: 20, cursor: 'pointer',
                transform: plan.popular ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.2s', position: 'relative',
              }}
            >
              {plan.popular && (
                <span style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: '#8729A0', color: 'white', fontSize: 10, fontWeight: 700, padding: '3px 12px', borderRadius: 20, letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                  MOST POPULAR
                </span>
              )}
              {isSelected && (
                <div style={{ position: 'absolute', top: 14, right: 14, width: 22, height: 22, borderRadius: '50%', background: '#8729A0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={13} color="white" />
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, paddingRight: 28 }}>
                <span style={{ color: '#E4F0F6', fontWeight: 700, fontSize: 16, fontFamily: 'Space Grotesk, sans-serif' }}>{plan.name}</span>
                <span style={{ color: isSelected ? '#8729A0' : '#8892A4', fontWeight: 700, fontSize: 16 }}>{plan.price}</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#8892A4', fontSize: 13 }}>
                    <Check size={12} color="#8729A0" style={{ flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      {error && (
        <div style={{ background: '#ef444415', border: '1px solid #ef4444', borderRadius: 8, padding: '12px 16px', marginTop: 16, color: '#ef4444', fontSize: 14 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <button
          onClick={onBack}
          disabled={loading}
          style={{ flex: 1, background: 'transparent', color: '#8892A4', borderRadius: 10, padding: '13px 0', fontWeight: 600, fontSize: 15, border: '1px solid #1a2400', cursor: 'pointer' }}
        >
          ← Back
        </button>
        <button
          disabled={loading}
          style={{ ...btnPrimary, flex: 2, opacity: loading ? 0.75 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          onClick={() => onSubmit(selected)}
        >
          {loading && <Spinner />}
          {loading ? 'Setting up…' : 'Launch My Orda →'}
        </button>
      </div>
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [step1Data, setStep1Data] = useState<Step1 | null>(null)
  const [step2Data, setStep2Data] = useState<Set<Platform>>(new Set())
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push('/sign-in')
    })
  }, [router])

  const handleStep1 = (data: Step1) => {
    setStep1Data(data)
    setStep(2)
  }

  const handleStep2 = (data: Set<Platform>) => {
    setStep2Data(data)
    setStep(3)
  }

  const handleSubmit = async (plan: PlanId) => {
    if (!step1Data) return
    setSubmitting(true)
    setSubmitError('')

    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/sign-in'); return }

    const { error } = await supabase.from('businesses').insert({
      user_id: session.user.id,
      name: step1Data.businessName,
      phone: `${step1Data.countryCode}${step1Data.phone}`,
      country: step1Data.country,
      plan,
      whatsapp_connected: step2Data.has('whatsapp'),
      instagram_connected: step2Data.has('instagram'),
      tiktok_connected: step2Data.has('tiktok'),
      facebook_connected: step2Data.has('facebook'),
    })

    setSubmitting(false)
    if (error) { setSubmitError(error.message); return }
    router.push('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111111', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '48px 16px' }}>
      <div style={{ width: '100%', maxWidth: 560 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg, #8729A0, #6a1f80)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: 18 }}>O</div>
            <span style={{ color: '#E4F0F6', fontWeight: 700, fontSize: 22, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}>ORDA</span>
          </div>
        </div>

        <StepIndicator current={step} />

        <div style={{ background: '#0A1200', border: '1px solid #1a2400', borderRadius: 16, padding: 40 }}>
          {step === 1 && <Step1Form onNext={handleStep1} />}
          {step === 2 && <Step2Form onNext={handleStep2} onBack={() => setStep(1)} />}
          {step === 3 && (
            <Step3Form
              onSubmit={handleSubmit}
              onBack={() => setStep(2)}
              loading={submitting}
              error={submitError}
            />
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
