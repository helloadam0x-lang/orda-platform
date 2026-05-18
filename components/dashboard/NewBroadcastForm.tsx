'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, Send, Check, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const PLATFORMS = ['WhatsApp', 'Instagram', 'TikTok', 'Facebook', 'All'] as const
type Platform = typeof PLATFORMS[number]
const TOKENS = ['{customer_name}', '{business_name}', '{date}']
const STEPS = ['Compose', 'Audience', 'Schedule'] as const

interface Props {
  businessId: string
  businessName: string
  totalContacts: number
}

export default function NewBroadcastForm({ businessId, businessName, totalContacts }: Props) {
  const router = useRouter()
  const [step, setStep] = useState(0)

  // Step 1 — Compose
  const [title, setTitle] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<Platform>>(new Set<Platform>(['WhatsApp']))
  const [message, setMessage] = useState('')

  // Step 2 — Audience
  const [allContacts, setAllContacts] = useState(true)
  const [platformAudience, setPlatformAudience] = useState('all')
  const [estimatedCount, setEstimatedCount] = useState(totalContacts)

  // Step 3 — Schedule
  const [sendNow, setSendNow] = useState(true)
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('09:00')

  const [submitting, setSubmitting] = useState(false)

  const charCount = message.length
  const maxChars  = 1600

  const insertToken = (token: string) => {
    setMessage(prev => prev + token)
  }

  const togglePlatform = (p: Platform) => {
    setSelectedPlatforms(prev => {
      const next = new Set<Platform>(prev)
      if (p === 'All') return new Set<Platform>(['All'])
      next.delete('All')
      if (next.has(p)) { next.delete(p) } else { next.add(p) }
      if (next.size === 0) next.add('All')
      return next
    })
  }

  const platformString = selectedPlatforms.has('All') ? 'all' : Array.from(selectedPlatforms).map(p => p.toLowerCase()).join(',')

  const previewMessage = message
    .replace('{customer_name}', 'John Doe')
    .replace('{business_name}', businessName)
    .replace('{date}', new Date().toLocaleDateString())

  const canProceed = [
    title.trim().length > 0 && message.trim().length > 0,
    true,
    sendNow || (scheduledDate.length > 0),
  ]

  const handleSubmit = async () => {
    if (!confirm(`Send this broadcast to ${estimatedCount} contacts? This cannot be undone.`)) return
    setSubmitting(true)

    const scheduledAt = !sendNow && scheduledDate
      ? new Date(`${scheduledDate}T${scheduledTime}`).toISOString()
      : null

    const sb = createClient()
    const { error } = await sb.from('broadcasts').insert({
      business_id: businessId,
      title: title.trim(),
      platform: platformString,
      message: message.trim(),
      status: sendNow ? 'sending' : 'scheduled',
      recipient_count: estimatedCount,
      sent_count: 0,
      delivered_count: 0,
      scheduled_at: scheduledAt,
      sent_at: sendNow ? new Date().toISOString() : null,
    })

    if (error) {
      toast.error('Failed to create broadcast')
      setSubmitting(false)
      return
    }

    toast.success(sendNow ? 'Broadcast is being sent!' : 'Broadcast scheduled!')
    router.push('/dashboard/broadcasts')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/dashboard/broadcasts')}
          className="p-2 rounded-lg text-[#8892A4] hover:text-[#E4F0F6] hover:bg-white/[0.04] transition-all">
          <ArrowLeft size={17} />
        </button>
        <div>
          <h1 className="text-[#E4F0F6] text-xl font-bold">New Broadcast</h1>
          <p className="text-[#8892A4] text-sm">Reach all your customers at once</p>
        </div>
      </div>

      {/* step indicator */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`flex items-center gap-2 flex-1 ${i > 0 ? '' : ''}`}>
              {i > 0 && <div className={`flex-1 h-px ${i <= step ? 'bg-[#8729A0]' : 'bg-[#1a2400]'} mr-3`} />}
              <div className={`flex items-center gap-2 whitespace-nowrap ${i < step ? 'cursor-pointer' : ''}`}
                onClick={() => i < step && setStep(i)}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i < step ? 'bg-[#8729A0] text-white' : i === step ? 'border-2 border-[#8729A0] text-[#8729A0]' : 'bg-[#1a2400] text-[#8892A4]'
                }`}>
                  {i < step ? <Check size={12} /> : i + 1}
                </div>
                <span className={`text-sm font-semibold ${i === step ? 'text-[#E4F0F6]' : 'text-[#8892A4]'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-[#8729A0]' : 'bg-[#1a2400]'} ml-3`} />}
            </div>
          </div>
        ))}
      </div>

      {/* ── STEP 1: Compose ─────────────────────────────────────────── */}
      {step === 0 && (
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="space-y-4">
            <div className="bg-[#0A1200] border border-[#1a2400] rounded-xl p-5 space-y-4">
              <div>
                <label className="text-[#8892A4] text-xs font-semibold mb-1.5 block">Broadcast Title (internal only) *</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Weekend Promo — June 2025"
                  className="w-full bg-[#111111] border border-[#1a2400] rounded-lg px-3 py-2.5 text-sm text-[#E4F0F6] placeholder:text-[#8892A4] outline-none focus:border-[#8729A0]/50" />
              </div>
              <div>
                <label className="text-[#8892A4] text-xs font-semibold mb-1.5 block">Platform</label>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map((p) => (
                    <button key={p} onClick={() => togglePlatform(p)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        selectedPlatforms.has(p)
                          ? 'border-[#8729A0]/60 bg-[#8729A0]/15 text-[#E4F0F6]'
                          : 'border-[#1a2400] text-[#8892A4] hover:text-[#E4F0F6]'
                      }`}>{p}</button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[#8892A4] text-xs font-semibold">Message *</label>
                  <span className={`text-xs ${charCount > maxChars * 0.9 ? 'text-[#F0A500]' : 'text-[#8892A4]'}`}>{charCount}/{maxChars}</span>
                </div>
                <textarea value={message} onChange={(e) => setMessage(e.target.value.slice(0, maxChars))}
                  rows={6} placeholder="Type your message here…"
                  className="w-full bg-[#111111] border border-[#1a2400] rounded-lg px-3 py-2.5 text-sm text-[#E4F0F6] placeholder:text-[#8892A4] outline-none focus:border-[#8729A0]/50 resize-none" />
                <div className="flex gap-2 mt-2 flex-wrap">
                  {TOKENS.map((t) => (
                    <button key={t} onClick={() => insertToken(t)}
                      className="px-2.5 py-1 rounded-lg bg-[#8729A0]/10 border border-[#8729A0]/30 text-[#8729A0] text-[11px] font-mono hover:bg-[#8729A0]/20 transition-all">
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* preview */}
          <div className="flex flex-col gap-3">
            <p className="text-[#8892A4] text-xs font-semibold uppercase tracking-wide">Preview</p>
            <div className="flex-1 flex items-center justify-center bg-[#0A1200] border border-[#1a2400] rounded-xl p-6 min-h-64">
              <div className="w-56">
                <div className="bg-[#111111] rounded-2xl overflow-hidden border border-[#1a2400]">
                  <div className="bg-[#25D366]/10 px-4 py-2.5 border-b border-[#1a2400]">
                    <p className="text-[#25D366] text-xs font-semibold">{businessName}</p>
                  </div>
                  <div className="p-3">
                    <div className="bg-[#1a2400] rounded-[4px_16px_16px_16px] px-3 py-2.5">
                      <p className="text-[#E4F0F6] text-xs leading-relaxed whitespace-pre-wrap">
                        {previewMessage || 'Your message will appear here…'}
                      </p>
                      <p className="text-[#8892A4] text-[9px] mt-1 text-right">Just now</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 2: Audience ─────────────────────────────────────────── */}
      {step === 1 && (
        <div className="bg-[#0A1200] border border-[#1a2400] rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[#E4F0F6] font-semibold">Select Audience</h3>
              <p className="text-[#8892A4] text-sm mt-0.5">Choose who receives this broadcast</p>
            </div>
            <div className="flex items-center gap-2 bg-[#8729A0]/10 border border-[#8729A0]/30 rounded-xl px-4 py-2">
              <Users size={15} className="text-[#8729A0]" />
              <span className="text-[#E4F0F6] font-bold">{estimatedCount}</span>
              <span className="text-[#8892A4] text-xs">recipients</span>
            </div>
          </div>

          <div>
            <button onClick={() => { setAllContacts(true); setEstimatedCount(totalContacts) }}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${
                allContacts ? 'border-[#8729A0]/40 bg-[#8729A0]/05' : 'border-[#1a2400] hover:border-[#8729A0]/20'
              }`}>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${allContacts ? 'border-[#8729A0]' : 'border-[#8892A4]'}`}>
                {allContacts && <div className="w-2 h-2 rounded-full bg-[#8729A0]" />}
              </div>
              <div className="text-left">
                <p className="text-[#E4F0F6] text-sm font-semibold">All Contacts</p>
                <p className="text-[#8892A4] text-xs">{totalContacts} contacts</p>
              </div>
            </button>
          </div>

          <div>
            <button onClick={() => { setAllContacts(false) }}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${
                !allContacts ? 'border-[#8729A0]/40 bg-[#8729A0]/05' : 'border-[#1a2400] hover:border-[#8729A0]/20'
              }`}>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${!allContacts ? 'border-[#8729A0]' : 'border-[#8892A4]'}`}>
                {!allContacts && <div className="w-2 h-2 rounded-full bg-[#8729A0]" />}
              </div>
              <div className="text-left">
                <p className="text-[#E4F0F6] text-sm font-semibold">Filter Contacts</p>
                <p className="text-[#8892A4] text-xs">By platform, tags, or activity</p>
              </div>
            </button>

            {!allContacts && (
              <div className="mt-3 p-4 bg-[#111111] rounded-xl border border-[#1a2400] space-y-3">
                <div>
                  <label className="text-[#8892A4] text-xs font-semibold mb-1.5 block">Platform</label>
                  <select value={platformAudience} onChange={(e) => { setPlatformAudience(e.target.value); setEstimatedCount(Math.round(totalContacts * (e.target.value === 'all' ? 1 : 0.4))) }}
                    className="w-full bg-[#0A1200] border border-[#1a2400] rounded-lg px-3 py-2 text-sm text-[#E4F0F6] outline-none focus:border-[#8729A0]/50">
                    <option value="all">All Platforms</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="facebook">Facebook</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── STEP 3: Schedule ─────────────────────────────────────────── */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="bg-[#0A1200] border border-[#1a2400] rounded-xl p-6 space-y-4">
            <h3 className="text-[#E4F0F6] font-semibold">When to send?</h3>
            <button onClick={() => setSendNow(true)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${sendNow ? 'border-[#8729A0]/40 bg-[#8729A0]/05' : 'border-[#1a2400]'}`}>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${sendNow ? 'border-[#8729A0]' : 'border-[#8892A4]'}`}>
                {sendNow && <div className="w-2 h-2 rounded-full bg-[#8729A0]" />}
              </div>
              <div className="text-left">
                <p className="text-[#E4F0F6] text-sm font-semibold">Send Now</p>
                <p className="text-[#8892A4] text-xs">Broadcast will start immediately</p>
              </div>
            </button>
            <button onClick={() => setSendNow(false)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${!sendNow ? 'border-[#8729A0]/40 bg-[#8729A0]/05' : 'border-[#1a2400]'}`}>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${!sendNow ? 'border-[#8729A0]' : 'border-[#8892A4]'}`}>
                {!sendNow && <div className="w-2 h-2 rounded-full bg-[#8729A0]" />}
              </div>
              <div className="text-left">
                <p className="text-[#E4F0F6] text-sm font-semibold">Schedule for Later</p>
                <p className="text-[#8892A4] text-xs">Pick a date and time</p>
              </div>
            </button>
            {!sendNow && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[#8892A4] text-xs mb-1.5 block">Date</label>
                  <input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-[#111111] border border-[#1a2400] rounded-lg px-3 py-2 text-sm text-[#E4F0F6] outline-none focus:border-[#8729A0]/50" />
                </div>
                <div>
                  <label className="text-[#8892A4] text-xs mb-1.5 block">Time</label>
                  <input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full bg-[#111111] border border-[#1a2400] rounded-lg px-3 py-2 text-sm text-[#E4F0F6] outline-none focus:border-[#8729A0]/50" />
                </div>
              </div>
            )}
          </div>

          {/* summary */}
          <div className="bg-[#0A1200] border border-[#1a2400] rounded-xl p-5 space-y-3">
            <p className="text-[#8892A4] text-xs font-semibold uppercase tracking-wide">Summary</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[#8892A4]">Title</span><span className="text-[#E4F0F6] font-semibold">{title}</span></div>
              <div className="flex justify-between"><span className="text-[#8892A4]">Platform</span><span className="text-[#E4F0F6] capitalize">{platformString}</span></div>
              <div className="flex justify-between"><span className="text-[#8892A4]">Recipients</span><span className="text-[#E4F0F6] font-semibold">{estimatedCount} contacts</span></div>
              <div className="flex justify-between"><span className="text-[#8892A4]">Send time</span><span className="text-[#E4F0F6]">{sendNow ? 'Immediately' : `${scheduledDate} at ${scheduledTime}`}</span></div>
            </div>
          </div>
        </div>
      )}

      {/* nav buttons */}
      <div className="flex items-center justify-between pt-2">
        <button onClick={() => step > 0 ? setStep(s => s - 1) : router.push('/dashboard/broadcasts')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#1a2400] text-[#8892A4] text-sm hover:text-[#E4F0F6] transition-all">
          <ArrowLeft size={14} /> {step === 0 ? 'Cancel' : 'Back'}
        </button>
        {step < 2 ? (
          <button onClick={() => setStep(s => s + 1)} disabled={!canProceed[step]}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-40 transition-all"
            style={{ background: 'linear-gradient(135deg, #8729A0, #6a1f80)' }}>
            Next <ArrowRight size={14} />
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={submitting || !canProceed[2]}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-40 transition-all"
            style={{ background: 'linear-gradient(135deg, #8729A0, #6a1f80)' }}>
            <Send size={14} /> {submitting ? 'Sending…' : 'Send Broadcast'}
          </button>
        )}
      </div>
    </div>
  )
}
