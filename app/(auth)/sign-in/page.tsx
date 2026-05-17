'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface FormErrors {
  email?: string
  password?: string
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

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [globalError, setGlobalError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = (): boolean => {
    const e: FormErrors = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Please enter a valid email address'
    if (!password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGlobalError('')
    if (!validate()) return
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { setGlobalError(error.message); return }
    router.refresh()
    router.push('/dashboard')
  }

  return (
    <div style={cardStyle}>
      <h1 style={{ color: '#E4F0F6', fontSize: 26, fontWeight: 700, margin: 0, fontFamily: 'Space Grotesk, sans-serif' }}>
        Welcome back
      </h1>
      <p style={{ color: '#8892A4', fontSize: 14, marginTop: 8, marginBottom: 0 }}>
        Sign in to your Orda account.
      </p>
      <div style={{ borderTop: '1px solid #1a2400', margin: '20px 0' }} />

      {globalError && (
        <div style={{ background: '#ef444415', border: '1px solid #ef4444', borderRadius: 8, padding: '12px 16px', marginBottom: 16, color: '#ef4444', fontSize: 14 }}>
          {globalError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label style={labelStyle}>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{ ...inputBase, border: `1px solid ${errors.email ? '#ef4444' : '#1a2400'}` }}
            onFocus={(e) => { if (!errors.email) { e.currentTarget.style.borderColor = '#8729A060'; e.currentTarget.style.boxShadow = '0 0 0 3px #8729A015' } }}
            onBlur={(e) => { if (!errors.email) { e.currentTarget.style.borderColor = '#1a2400'; e.currentTarget.style.boxShadow = 'none' } }}
          />
          {errors.email && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4, marginBottom: 0 }}>{errors.email}</p>}
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
            <Link href="/forgot-password" style={{ color: '#8892A4', fontSize: 12, textDecoration: 'none' }}>
              Forgot password?
            </Link>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              style={{ ...inputBase, border: `1px solid ${errors.password ? '#ef4444' : '#1a2400'}`, paddingRight: 44 }}
              onFocus={(e) => { if (!errors.password) { e.currentTarget.style.borderColor = '#8729A060'; e.currentTarget.style.boxShadow = '0 0 0 3px #8729A015' } }}
              onBlur={(e) => { if (!errors.password) { e.currentTarget.style.borderColor = '#1a2400'; e.currentTarget.style.boxShadow = 'none' } }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8892A4', display: 'flex', padding: 0 }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4, marginBottom: 0 }}>{errors.password}</p>}
        </div>

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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 0.7s linear infinite' }}>
              <path d="M21 12a9 9 0 11-6.219-8.56" />
            </svg>
          )}
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: 20, color: '#8892A4', fontSize: 14, marginBottom: 0 }}>
        New to Orda?{' '}
        <Link href="/sign-up" style={{ color: '#8729A0', fontWeight: 600, textDecoration: 'none' }}>
          Start free trial
        </Link>
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
