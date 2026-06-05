'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { MessageSquare, Search, Send, Pause, Play, X } from 'lucide-react'
import { getAvatarGradient, timeAgo } from '@/lib/format'

interface Conversation {
  id: string
  contact_id: string
  contact_name: string
  contact_phone: string
  last_message: string
  last_message_at: string
  unread_count: number
  is_ai_handling: boolean
  status: 'open' | 'closed'
}

interface Message {
  id: string
  content: string
  role: 'customer' | 'assistant' | 'owner'
  is_ai: boolean
  created_at: string
}

export default function ConversationsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [convos, setConvos] = useState<Conversation[]>([])
  const [selected, setSelected] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all')
  const [loading, setLoading] = useState(true)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [togglingAI, setTogglingAI] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/sign-in'); return }
      supabase.from('businesses').select('id').eq('user_id', user.id).single()
        .then(({ data }) => { if (data) setBusinessId(data.id) })
    })
  }, [])

  const fetchConvos = useCallback(async () => {
    if (!businessId) return
    setLoading(true)
    const q = supabase
      .from('conversations')
      .select(`id, is_ai_handling, status, last_message, last_message_at, unread_count,
        contacts(id, name, phone)`)
      .eq('business_id', businessId)
      .order('last_message_at', { ascending: false })
      .limit(100)

    if (filter !== 'all') q.eq('status', filter)

    const { data } = await q
    setLoading(false)
    if (!data) return

    const mapped: Conversation[] = data.map((c: any) => ({
      id: c.id,
      contact_id: c.contacts?.id ?? '',
      contact_name: c.contacts?.name ?? 'Unknown',
      contact_phone: c.contacts?.phone ?? '',
      last_message: c.last_message ?? '',
      last_message_at: c.last_message_at ?? '',
      unread_count: c.unread_count ?? 0,
      is_ai_handling: c.is_ai_handling ?? true,
      status: c.status ?? 'open',
    }))

    const q2 = search
      ? mapped.filter(c =>
          c.contact_name.toLowerCase().includes(search.toLowerCase()) ||
          c.contact_phone.includes(search))
      : mapped
    setConvos(q2)
  }, [businessId, filter, search])

  useEffect(() => { fetchConvos() }, [fetchConvos])

  useEffect(() => {
    if (!businessId) return
    const ch = supabase.channel('convos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations', filter: `business_id=eq.${businessId}` },
        () => fetchConvos())
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [businessId])

  useEffect(() => {
    if (!selected) return
    supabase
      .rpc('get_conversation_history', { p_conversation_id: selected.id, p_limit: 50 })
      .then(({ data }) => setMessages((data as Message[]) ?? []))

    const ch = supabase.channel(`msgs-${selected.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${selected.id}` },
        (p) => setMessages(prev => [...prev, p.new as Message]))
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [selected?.id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function toggleAI() {
    if (!selected) return
    setTogglingAI(true)
    await fetch(`/api/conversations/${selected.id}/toggle-ai`, { method: 'PATCH' })
    setSelected(prev => prev ? { ...prev, is_ai_handling: !prev.is_ai_handling } : prev)
    setTogglingAI(false)
  }

  async function sendReply() {
    if (!reply.trim() || !selected || !businessId) return
    setSending(true)
    await fetch('/api/whatsapp/send-to-customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessId, customerPhone: selected.contact_phone, message: reply }),
    })
    setReply('')
    setSending(false)
  }

  const filtered = convos

  return (
    <div className="flex h-full" style={{ background: 'var(--void)' }}>
      {/* Left panel */}
      <div
        className="w-80 shrink-0 flex flex-col h-full"
        style={{ borderRight: '1px solid var(--border)', background: 'var(--surface-1)' }}
      >
        <div className="p-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex gap-1 mb-3">
            {(['all', 'open', 'closed'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-1 rounded-full text-[12px] font-medium capitalize transition-colors duration-150"
                style={{
                  background: filter === f ? 'var(--accent)' : 'var(--surface-3)',
                  color: filter === f ? 'var(--void)' : 'var(--text-2)',
                }}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search conversations…"
              className="w-full pl-8 pr-3 py-2 rounded-[var(--r-md)] text-[13px] bg-[var(--surface-3)] text-[var(--text-1)] placeholder:text-[var(--text-3)] outline-none"
              style={{ border: '1px solid var(--border)' }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-3 p-4" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="w-10 h-10 rounded-full skeleton shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 skeleton rounded" />
                  <div className="h-3 w-36 skeleton rounded" />
                </div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-[var(--text-3)] text-[13px]">
              <MessageSquare size={24} className="mb-2 opacity-40" />
              No conversations
            </div>
          ) : filtered.map(c => (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              className="w-full flex gap-3 p-4 text-left transition-colors duration-150 hover:bg-[var(--surface-2)]"
              style={{
                borderBottom: '1px solid var(--border)',
                borderLeft: selected?.id === c.id ? '3px solid var(--accent)' : '3px solid transparent',
                background: selected?.id === c.id ? 'var(--accent-dim)' : undefined,
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0"
                style={{ background: getAvatarGradient(c.contact_name) }}
              >
                {c.contact_name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[13px] font-semibold text-[var(--text-1)] truncate">{c.contact_name}</span>
                  <span className="text-[11px] text-[var(--text-3)] shrink-0 ml-2">{timeAgo(c.last_message_at)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[var(--text-2)] truncate">{c.last_message}</span>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {c.is_ai_handling && (
                      <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
                    )}
                    {c.unread_count > 0 && (
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: 'var(--accent)', color: 'var(--void)' }}
                      >
                        {c.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right panel */}
      {selected ? (
        <div className="flex-1 flex flex-col h-full min-w-0">
          {/* Thread header */}
          <div
            className="flex items-center justify-between px-5 h-16 shrink-0"
            style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-1)' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0"
                style={{ background: getAvatarGradient(selected.contact_name) }}
              >
                {selected.contact_name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="text-[14px] font-semibold text-[var(--text-1)]">{selected.contact_name}</div>
                <div className="text-[12px] text-[var(--text-3)]">{selected.contact_phone}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleAI}
                disabled={togglingAI}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-150"
                style={{
                  background: selected.is_ai_handling ? 'var(--success-dim)' : 'rgba(212,168,83,0.1)',
                  color: selected.is_ai_handling ? 'var(--success)' : 'var(--accent)',
                  border: `1px solid ${selected.is_ai_handling ? 'rgba(34,197,94,0.3)' : 'var(--accent-border)'}`,
                }}
              >
                {selected.is_ai_handling ? <><Play size={11} />AI Active</> : <><Pause size={11} />AI Paused</>}
              </button>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded text-[var(--text-3)] hover:text-[var(--text-1)]">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {messages.map(msg => {
              const isCustomer = msg.role === 'customer'
              const isAI = msg.role === 'assistant'
              return (
                <div key={msg.id} className={`flex ${isCustomer ? 'justify-start' : 'justify-end'}`}>
                  <div
                    className="max-w-[72%] px-4 py-2.5 text-[13px] leading-relaxed"
                    style={{
                      background: isCustomer ? 'var(--surface-2)' : isAI ? 'var(--accent-dim)' : 'rgba(96,165,250,0.08)',
                      border: `1px solid ${isCustomer ? 'var(--border)' : isAI ? 'var(--accent-border)' : 'rgba(96,165,250,0.2)'}`,
                      borderRadius: isCustomer ? '4px 18px 18px 18px' : '18px 4px 18px 18px',
                      color: 'var(--text-1)',
                    }}
                  >
                    {!isCustomer && (
                      <div className="text-[10px] font-semibold mb-1" style={{ color: isAI ? 'var(--accent)' : 'rgba(96,165,250,0.8)' }}>
                        {isAI ? 'AI' : 'You'}
                      </div>
                    )}
                    {msg.content}
                    <div className="text-[10px] mt-1" style={{ color: 'var(--text-3)' }}>{timeAgo(msg.created_at)}</div>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-5 pb-5 shrink-0">
            <div
              className="flex items-end gap-3 p-3 rounded-[var(--r-lg)]"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
            >
              <textarea
                value={reply}
                onChange={e => setReply(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply() } }}
                placeholder="Type a message…"
                rows={2}
                className="flex-1 bg-transparent text-[13px] text-[var(--text-1)] placeholder:text-[var(--text-3)] resize-none outline-none"
              />
              <button
                onClick={sendReply}
                disabled={sending || !reply.trim()}
                className="p-2.5 rounded-[var(--r-md)] transition-all duration-150 shrink-0 disabled:opacity-40"
                style={{ background: 'var(--accent)', color: 'var(--void)' }}
                onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)' }}
                onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-[var(--text-3)]">
          <MessageSquare size={40} className="mb-3 opacity-30" />
          <div className="text-[14px]">Select a conversation</div>
        </div>
      )}
    </div>
  )
}
