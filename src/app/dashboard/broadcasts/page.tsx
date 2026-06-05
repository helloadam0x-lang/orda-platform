'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Radio, Send, Users } from 'lucide-react'
import { timeAgo } from '@/lib/format'

interface Broadcast {
  id: string
  title: string
  message: string
  audience: string
  sent_count: number
  created_at: string
  status: string
}

export default function BroadcastsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [audience, setAudience] = useState<'all' | 'vip' | 'ordered'>('all')
  const [audienceCount, setAudienceCount] = useState<number | null>(null)
  const [preview, setPreview] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/sign-in'); return }
      supabase.from('businesses').select('id').eq('user_id', user.id).single()
        .then(({ data: biz }) => { if (biz) setBusinessId(biz.id) })
    })
  }, [])

  useEffect(() => {
    if (!businessId) return
    setLoading(true)
    supabase.from('broadcasts').select('*').eq('business_id', businessId)
      .order('created_at', { ascending: false }).limit(20)
      .then(({ data }) => { setBroadcasts((data as Broadcast[]) ?? []); setLoading(false) })
  }, [businessId])

  useEffect(() => {
    if (!businessId) return
    let q = supabase.from('contacts').select('id', { count: 'exact', head: true })
      .eq('business_id', businessId).eq('is_blocked', false)
    if (audience === 'vip') q = q.eq('is_vip', true)
    if (audience === 'ordered') q = q.gt('order_count', 0)
    q.then(({ count }) => setAudienceCount(count ?? 0))
  }, [businessId, audience])

  useEffect(() => {
    setPreview(message.replace('{{name}}', 'James'))
  }, [message])

  async function sendBroadcast() {
    if (!title || !message || !businessId) return
    setSending(true)
    await supabase.from('broadcasts').insert({
      business_id: businessId,
      title, message, audience,
      status: 'queued',
      sent_count: 0,
    })
    await fetch('/api/whatsapp/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessId, message, audience }),
    }).catch(() => {})
    setTitle('')
    setMessage('')
    setSending(false)
    supabase.from('broadcasts').select('*').eq('business_id', businessId)
      .order('created_at', { ascending: false }).limit(20)
      .then(({ data }) => setBroadcasts((data as Broadcast[]) ?? []))
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="font-['Playfair_Display'] font-black text-2xl text-[var(--text-1)]">Broadcasts</h1>
        <p className="text-[13px] text-[var(--text-3)] mt-1">Send WhatsApp messages to your customers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compose */}
        <div className="rounded-[var(--r-xl)] p-5 space-y-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
          <div className="text-[14px] font-semibold text-[var(--text-1)]">New Broadcast</div>

          <div>
            <label className="text-[12px] text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Title (internal)</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Weekend sale announcement"
              className="w-full px-3 py-2.5 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-3)] text-[var(--text-1)] placeholder:text-[var(--text-3)] outline-none"
              style={{ border: '1px solid var(--border)' }}
            />
          </div>

          <div>
            <label className="text-[12px] text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">
              Message <span className="normal-case font-normal">— use {`{{name}}`} for customer name</span>
            </label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value.slice(0, 500))}
              placeholder="Hey {{name}}! We have a special offer just for you…"
              rows={5}
              className="w-full px-3 py-2.5 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-3)] text-[var(--text-1)] placeholder:text-[var(--text-3)] outline-none resize-none"
              style={{ border: '1px solid var(--border)' }}
            />
            <div className="text-right text-[11px] text-[var(--text-3)] mt-1">{message.length}/500</div>
          </div>

          <div>
            <label className="text-[12px] text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Audience</label>
            <div className="grid grid-cols-3 gap-2">
              {(['all', 'vip', 'ordered'] as const).map(a => (
                <button
                  key={a}
                  onClick={() => setAudience(a)}
                  className="py-2 rounded-[var(--r-md)] text-[12px] font-medium capitalize transition-all duration-150"
                  style={{
                    background: audience === a ? 'var(--accent-dim)' : 'var(--surface-3)',
                    border: `1px solid ${audience === a ? 'var(--accent-border)' : 'var(--border)'}`,
                    color: audience === a ? 'var(--accent)' : 'var(--text-2)',
                  }}
                >
                  {a === 'ordered' ? 'Has Ordered' : a}
                </button>
              ))}
            </div>
            {audienceCount !== null && (
              <div className="flex items-center gap-1.5 mt-2 text-[12px] text-[var(--text-3)]">
                <Users size={12} /> Will send to <span className="text-[var(--text-1)] font-medium">{audienceCount}</span> contacts
              </div>
            )}
          </div>

          <button
            onClick={sendBroadcast}
            disabled={sending || !title || !message}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[var(--r-md)] text-[13px] font-semibold transition-all duration-150 disabled:opacity-40"
            style={{ background: 'var(--accent)', color: 'var(--void)' }}
            onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)' }}
            onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
          >
            <Send size={14} />
            {sending ? 'Sending…' : 'Send Broadcast'}
          </button>
        </div>

        {/* Preview */}
        <div className="rounded-[var(--r-xl)] p-5" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
          <div className="text-[14px] font-semibold text-[var(--text-1)] mb-4">Preview</div>
          <div className="rounded-[var(--r-lg)] p-4" style={{ background: '#075e54', minHeight: 120 }}>
            <div
              className="inline-block max-w-[85%] px-3 py-2 rounded-[4px_18px_18px_18px] text-white text-[13px] leading-relaxed"
              style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(4px)' }}
            >
              {preview || <span className="opacity-50">Your message will appear here…</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Past broadcasts */}
      <div>
        <div className="text-[14px] font-semibold text-[var(--text-1)] mb-3">Past Broadcasts</div>
        {loading ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 skeleton rounded-[var(--r-lg)]" />)}</div>
        ) : broadcasts.length === 0 ? (
          <div className="py-10 text-center text-[var(--text-3)] text-[13px]">
            <Radio size={24} className="mx-auto mb-2 opacity-30" />
            No broadcasts yet
          </div>
        ) : broadcasts.map(b => (
          <div
            key={b.id}
            className="flex items-center justify-between px-4 py-3 rounded-[var(--r-lg)] mb-2"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
          >
            <div>
              <div className="text-[13px] font-semibold text-[var(--text-1)]">{b.title}</div>
              <div className="text-[12px] text-[var(--text-3)] mt-0.5">{b.message.slice(0, 60)}…</div>
            </div>
            <div className="text-right shrink-0 ml-4">
              <div className="text-[12px] text-[var(--text-2)]">{b.sent_count} sent</div>
              <div className="text-[11px] text-[var(--text-3)]">{timeAgo(b.created_at)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
