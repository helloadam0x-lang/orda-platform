'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AuthShell from '@/components/auth/AuthShell'
import Link from 'next/link'
import { Mail } from 'lucide-react'

export default function SignInPage() {
  const supabase = createClient()
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
            We sent a sign-in link to <span style={{ color: '#D4A853' }}>{email}</span>.<br />
            No password needed — just click the link.
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
            Welcome back.
          </h1>
          <p className="text-[15px] text-[rgba(239,239,239,0.50)] leading-relaxed">
            Your customers never stopped messaging. Let's get you back in.
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
              className="w-full px-4 py-3 rounded-[10px] text-[14px] text-[#EFEFEF] placeholder:text-[rgba(239,239,239,0.3)] outline-none"
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
              {loading ? 'Sending…' : 'Email me a sign-in link'}
            </button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-[14px] text-[rgba(239,239,239,0.5)]">
            New to Orda?{' '}
            <Link href="/sign-up" style={{ color: '#D4A853' }} className="font-medium">Start free →</Link>
          </p>
        </div>
      </div>
    </AuthShell>
  )
}
