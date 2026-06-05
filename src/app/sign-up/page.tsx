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
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/api/auth/callback`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    })
  }

  async function signInWithApple() {
    setOauthLoading('apple')
    await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo: `${origin}/api/auth/callback` },
    })
  }

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${origin}/api/auth/callback` },
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
          {/* Google */}
          <button
            onClick={signInWithGoogle}
            disabled={!!oauthLoading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-[10px] text-[14px] font-semibold transition-all duration-150 disabled:opacity-60"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.11)', color: '#EFEFEF' }}
            onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)' }}
            onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
          >
            {oauthLoading === 'google' ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg width={18} height={18} viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Continue with Google
          </button>

          {/* Apple */}
          <button
            onClick={signInWithApple}
            disabled={!!oauthLoading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-[10px] text-[14px] font-semibold transition-all duration-150 disabled:opacity-60"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.11)', color: '#EFEFEF' }}
            onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)' }}
            onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
          >
            {oauthLoading === 'apple' ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg width={16} height={18} viewBox="0 0 814 1000" fill="currentColor">
                <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 133.4-317.5 264.6-317.5 70.1 0 128.9 46.4 173.1 46.4 42.8 0 109.6-49 192.7-49 31.1 0 108.2 2.6 168.2 83.2zm-87.4-227.5c36.1-43.8 61.6-105 61.6-166.3 0-8.4-.6-16.8-2-24.5-57.1 2.1-124.6 38.2-165.2 82.5-31.8 35.5-62.8 96.8-62.8 158.7 0 9.7 1.9 19.5 2.6 22.4 3.9.6 10.4 1.3 16.8 1.3 51.3 0 113.1-34.4 148.9-74.1z" />
              </svg>
            )}
            Continue with Apple
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 py-1">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <span className="text-[12px] text-[rgba(239,239,239,0.3)]">or email</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
          </div>

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
