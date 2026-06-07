'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AuthShell from '@/components/auth/AuthShell'
import Link from 'next/link'
import { Mail } from 'lucide-react'

function SignUpForm() {
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const referrer = searchParams.get('referrer')

  const [email, setEmail] = useState('')
  const [magicSent, setMagicSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<'google' | 'apple' | null>(null)
  const [error, setError] = useState('')

  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  async function signInWithGoogle() {
    setOauthLoading('google')
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/api/auth/callback`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    })
    if (err) {
      setOauthLoading(null)
      setError('Google sign-in is not enabled yet. Use your email below.')
    }
  }

  async function signInWithApple() {
    setOauthLoading('apple')
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo: `${origin}/api/auth/callback` },
    })
    if (err) {
      setOauthLoading(null)
      setError('Apple sign-in is not enabled yet. Use your email below.')
    }
  }

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/api/auth/callback`,
        shouldCreateUser: true,
      },
    })
    setLoading(false)
    if (err) { setError(err.message); return }
    setMagicSent(true)
  }

  if (magicSent) return (
    <AuthShell>
      <div className="w-full space-y-6 text-center">
        <div
          className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
          style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}
        >
          <Mail size={24} style={{ color: '#22C55E' }} />
        </div>
        <div>
          <h1 className="font-['Playfair_Display'] font-black text-[32px] text-[#EFEFEF] leading-tight">Check your email</h1>
          <p className="text-[14px] text-[rgba(239,239,239,0.5)] mt-2 leading-relaxed">
            We sent a magic link to <span style={{ color: '#D4A853' }}>{email}</span>.<br />
            Click it to sign in — no password needed.
          </p>
        </div>
        <button
          onClick={() => setMagicSent(false)}
          className="text-[13px] text-[rgba(239,239,239,0.4)] hover:text-[rgba(239,239,239,0.7)] transition-colors"
        >
          Use a different email
        </button>
      </div>
    </AuthShell>
  )

  return (
    <AuthShell>
      <div className="w-full space-y-8">
        <div className="space-y-2">
          <h1 className="font-['Playfair_Display'] font-black text-[38px] leading-[0.95] tracking-tight text-[#EFEFEF]">
            Start free for 7 days.
          </h1>
          <p className="text-[15px] text-[rgba(239,239,239,0.50)] leading-relaxed">
            {referrer
              ? `${referrer} invited you to Orda.`
              : 'Connect your WhatsApp. Let your AI agent start working tonight.'}
          </p>
        </div>

        <div className="space-y-3">
          {/* Magic link */}
          <form onSubmit={sendMagicLink} className="space-y-3">
            {error && (
              <div
                className="px-4 py-3 rounded-[8px] text-[13px]"
                style={{ background: 'rgba(220,80,80,0.07)', border: '1px solid rgba(220,80,80,0.18)', color: '#f08080' }}
              >
                {error}
              </div>
            )}
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-[10px] text-[14px] text-[#EFEFEF] placeholder:text-[rgba(239,239,239,0.3)] outline-none transition-colors duration-150"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-[10px] text-[14px] font-semibold transition-all duration-150 disabled:opacity-50"
              style={{ background: '#D4A853', color: '#050507' }}
              onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)' }}
              onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
            >
              <Mail size={15} />
              {loading ? 'Sending…' : 'Send me a magic link'}
            </button>
          </form>
        </div>

        <div className="space-y-4 text-center">
          <p className="text-[14px] text-[rgba(239,239,239,0.5)]">
            Already have an account?{' '}
            <Link href="/sign-in" style={{ color: '#D4A853' }} className="font-medium">Sign in</Link>
          </p>
          <p className="text-[11px] text-[rgba(239,239,239,0.18)] leading-relaxed">
            No credit card required · Cancel anytime ·{' '}
            <Link href="/terms" style={{ color: 'rgba(212,168,83,0.5)' }}>Terms</Link>
            {' & '}
            <Link href="/privacy" style={{ color: 'rgba(212,168,83,0.5)' }}>Privacy</Link>
          </p>
        </div>
      </div>
    </AuthShell>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div style={{ background: '#050507', minHeight: '100vh' }} />}>
      <SignUpForm />
    </Suspense>
  )
}
