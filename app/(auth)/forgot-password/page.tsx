'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const cardStyle: React.CSSProperties = {
  background: '#0A1200',
  border: '1px solid #1a2400',
  borderRadius: 16,
  padding: 40,
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [globalError, setGlobalError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGlobalError('')
    setEmailError('')

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    })
    setLoading(false)

    if (error) { setGlobalError(error.message); return }
    setSuccess(true)
  }

  return (
    <div style={cardStyle}>
      <h1 style={{ color: '#E4F0F6', fontSize: 26, fontWeight: 700, margin: 0, fontFamily: 'Space Grotesk, sans-serif' }}>
        Reset your password
      </h1>
      <p style={{ color: '#8892A4', fontSize: 14, marginTop: 8, marginBottom: 0 }}>
        Enter your email and we&apos;ll send you a reset link.
      </p>
      <div style={{ borderTop: '1px solid #1a2400', margin: '20px 0' }} />

      {globalError && (
        <div style={{ background: '#ef444415', border: '1px solid #ef4444', borderRadius: 8, padding: '12px 16px', marginBottom: 16, color: '#ef4444', fontSize: 14 }}>
          {globalError}
        </div>
      )}

      {success ? (
        <div style={{ background: '#16a34a15', border: '1px solid #16a34a', borderRadius: 8, padding: '16px', color: '#4ade80', fontSize: 14, lineHeight: 1.5 }}>
          ✓ Check your email for a reset link.
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ display: 'block', color: '#8892A4', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6, fontWeight: 500 }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: '100%',
                background: '#111111',
                color: '#E4F0F6',
                fontSize: 14,
                padding: '12px 16px',
                borderRadius: 10,
                outline: 'none',
                boxSizing: 'border-box',
                border: `1px solid ${emailError ? '#ef4444' : '#1a2400'}`,
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={(e) => { if (!emailError) { e.currentTarget.style.borderColor = '#8729A060'; e.currentTarget.style.boxShadow = '0 0 0 3px #8729A015' } }}
              onBlur={(e) => { if (!emailError) { e.currentTarget.style.borderColor = '#1a2400'; e.currentTarget.style.boxShadow = 'none' } }}
            />
            {emailError && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4, marginBottom: 0 }}>{emailError}</p>}
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
            }}
          >
            {loading && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 0.7s linear infinite' }}>
                <path d="M21 12a9 9 0 11-6.219-8.56" />
              </svg>
            )}
            {loading ? 'Sending…' : 'Send Reset Link'}
          </button>
        </form>
      )}

      <p style={{ textAlign: 'center', marginTop: 20, color: '#8892A4', fontSize: 14, marginBottom: 0 }}>
        <Link href="/sign-in" style={{ color: '#8729A0', fontWeight: 600, textDecoration: 'none' }}>
          ← Back to sign in
        </Link>
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
