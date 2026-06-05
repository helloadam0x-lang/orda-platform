'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Star, Copy, Share2, Check } from 'lucide-react'

export default function ReferralsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [business, setBusiness] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [stats, setStats] = useState({ referred: 0, earned_months: 0 })

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/sign-in'); return }
      supabase.from('businesses').select('id, referral_code, slug').eq('user_id', user.id).single()
        .then(({ data: biz }) => {
          if (biz) {
            setBusiness(biz)
            supabase.from('referrals').select('id, status')
              .eq('referrer_business_id', biz.id)
              .then(({ data: refs }) => {
                if (refs) setStats({
                  referred: refs.length,
                  earned_months: refs.filter((r: any) => r.status === 'rewarded').length,
                })
              })
          }
          setLoading(false)
        })
    })
  }, [])

  const referralLink = business ? `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://getorda.app'}/join/${business.referral_code}` : ''

  function copyLink() {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function shareWhatsApp() {
    const text = encodeURIComponent(`Try Orda — WhatsApp AI for your business! Use my link to get started: ${referralLink}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-['Playfair_Display'] font-black text-2xl text-[var(--text-1)]">Referrals</h1>
        <p className="text-[13px] text-[var(--text-3)] mt-1">Earn a free month for every business you refer</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Businesses Referred', value: stats.referred },
          { label: 'Free Months Earned', value: stats.earned_months },
        ].map(s => (
          <div key={s.label} className="rounded-[var(--r-xl)] p-5" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <div className="text-[11px] uppercase tracking-wide text-[var(--text-3)] mb-2">{s.label}</div>
            <div className="font-['Playfair_Display'] font-black text-3xl" style={{ color: 'var(--accent)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Referral link */}
      {loading ? (
        <div className="h-32 skeleton rounded-[var(--r-xl)]" />
      ) : (
        <div className="rounded-[var(--r-xl)] p-5 space-y-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
          <div>
            <div className="text-[12px] uppercase tracking-wide text-[var(--text-3)] mb-1">Your Referral Code</div>
            <div className="font-['Playfair_Display'] font-black text-2xl" style={{ color: 'var(--accent)' }}>{business?.referral_code}</div>
          </div>
          <div
            className="flex items-center justify-between gap-3 px-4 py-3 rounded-[var(--r-md)]"
            style={{ background: 'var(--surface-3)', border: '1px solid var(--border)' }}
          >
            <span className="text-[13px] text-[var(--text-2)] truncate">{referralLink}</span>
            <button
              onClick={copyLink}
              className="p-1.5 shrink-0 rounded transition-colors duration-150"
              style={{ color: copied ? 'var(--success)' : 'var(--text-3)' }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="flex gap-3">
            <button
              onClick={copyLink}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[var(--r-md)] text-[13px] font-semibold transition-all duration-150"
              style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-1)' }}
              onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)' }}
              onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
            >
              <Copy size={14} /> Copy Link
            </button>
            <button
              onClick={shareWhatsApp}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[var(--r-md)] text-[13px] font-semibold transition-all duration-150"
              style={{ background: 'var(--whatsapp)', color: '#fff' }}
              onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)' }}
              onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
            >
              <Share2 size={14} /> Share via WhatsApp
            </button>
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="rounded-[var(--r-xl)] p-5" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
        <div className="text-[14px] font-semibold text-[var(--text-1)] mb-4">How it works</div>
        <div className="space-y-4">
          {[
            { step: '01', title: 'Share your link', desc: 'Share your unique referral link with other businesses.' },
            { step: '02', title: 'They sign up', desc: 'When they sign up using your link, they get 7 days free too.' },
            { step: '03', title: 'You earn', desc: 'After they subscribe, you get 1 free month added to your plan.' },
          ].map(s => (
            <div key={s.step} className="flex gap-4">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}
              >
                {s.step}
              </div>
              <div>
                <div className="text-[13px] font-semibold text-[var(--text-1)]">{s.title}</div>
                <div className="text-[12px] text-[var(--text-3)] mt-0.5">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
