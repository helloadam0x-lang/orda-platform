'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface FormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
}

const cardStyle: React.CSSProperties = {
  background: '#0A1200',
  border: '1px solid #1a2400',
  borderRadius: 16,
  padding: 40,
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  color: '#8892A4',
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginBottom: 6,
  fontWeight: 500,
}

const inputBase: React.CSSProperties = {
  width: '100%',
  background: '#111111',
  color: '#E4F0F6',
  fontSize: 14,
  padding: '12px 16px',
  borderRadius: 10,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}

function InputField({
  label,
  type,
  value,
  onChange,
  placeholder,
  error,
  rightElement,
}: {
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  error?: string
  rightElement?: React.ReactNode
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            ...inputBase,
            border: `1px solid ${error ? '#ef4444' : '#1a2400'}`,
            paddingRight: rightElement ? 44 : 16,
          }}
          onFocus={(e) => {
            if (!error) {
              e.currentTarget.style.borderColor = '#8729A060'
              e.currentTarget.style.boxShadow = '0 0 0 3px #8729A015'
            }
          }}
          onBlur={(e) => {
            if (!error) {
              e.currentTarget.style.borderColor = '#1a2400'
              e.currentTarget.style.boxShadow = 'none'
            }
          }}
        />
        {rightElement && (
          <div
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4, marginBottom: 0 }}>{error}</p>
      )}
    </div>
  )
}

export default function SignUpPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [globalError, setGlobalError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const set = (field: keyof FormData) => (v: string) =>
    setForm((p) => ({ ...p, [field]: v }))

  const validate = (): boolean => {
    const e: FormErrors = {}
    if (form.fullName.trim().length < 2) e.fullName = 'Full name must be at least 2 characters'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email address'
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGlobalError('')
    if (!validate()) return
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.fullName } },
    })
    setLoading(false)
    if (error) { setGlobalError(error.message); return }
    router.push('/onboarding')
  }

  const eyeBtn = (show: boolean, toggle: () => void): React.ReactNode => (
    <button
      type="button"
      onClick={toggle}
      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8892A4', display: 'flex', padding: 0 }}
    >
      {show ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  )

  return (
    <div style={cardStyle}>
      <h1 style={{ color: '#E4F0F6', fontSize: 26, fontWeight: 700, margin: 0, fontFamily: 'Space Grotesk, sans-serif' }}>
        Create your account
      </h1>
      <p style={{ color: '#8892A4', fontSize: 14, marginTop: 8, marginBottom: 0 }}>
        Start your free 7-day trial. No credit card required.
      </p>
      <div style={{ borderTop: '1px solid #1a2400', margin: '20px 0' }} />

      {globalError && (
        <div style={{ background: '#ef444415', border: '1px solid #ef4444', borderRadius: 8, padding: '12px 16px', marginBottom: 16, color: '#ef4444', fontSize: 14 }}>
          {globalError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <InputField
          label="Full Name"
          type="text"
          value={form.fullName}
          onChange={set('fullName')}
          placeholder="John Doe"
          error={errors.fullName}
        />
        <InputField
          label="Email Address"
          type="email"
          value={form.email}
          onChange={set('email')}
          placeholder="you@example.com"
          error={errors.email}
        />
        <InputField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={set('password')}
          placeholder="Min. 8 characters"
          error={errors.password}
          rightElement={eyeBtn(showPassword, () => setShowPassword((v) => !v))}
        />
        <InputField
          label="Confirm Password"
          type={showConfirm ? 'text' : 'password'}
          value={form.confirmPassword}
          onChange={set('confirmPassword')}
          placeholder="Repeat password"
          error={errors.confirmPassword}
          rightElement={eyeBtn(showConfirm, () => setShowConfirm((v) => !v))}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #8729A0, #6a1f80)',
            color: 'white',
            borderRadius: 10,
            padding: '13px 0',
            fontWeight: 600,
            fontSize: 15,
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            opacity: loading ? 0.75 : 1,
            marginTop: 4,
          }}
        >
          {loading && (
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2" strokeLinecap="round"
              style={{ animation: 'spin 0.7s linear infinite' }}
            >
              <path d="M21 12a9 9 0 11-6.219-8.56" />
            </svg>
          )}
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: 20, color: '#8892A4', fontSize: 14, marginBottom: 0 }}>
        Already have an account?{' '}
        <Link href="/sign-in" style={{ color: '#8729A0', fontWeight: 600, textDecoration: 'none' }}>
          Sign in
        </Link>
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
