'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Send, Bot, ArrowLeft, Phone, Mail, ShoppingBag, ChevronRight, Tag, MessageSquare } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { Conversation, Message, ConvFilterCounts } from '@/types/database'

// ── helpers ──────────────────────────────────────────────────────────────────
function getInitials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
}
function timeAgo(ts: string) {
  try {
    const diff = Date.now() - new Date(ts).getTime()
    if (diff < 60000) return 'now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d`
    return new Date(ts).toLocaleDateString('en', { month: 'short', day: 'numeric' })
  } catch { return '' }
}
function fmtTime(ts: string) {
  try { return new Date(ts).toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit', hour12: true }) } catch { return '' }
}
function platformColor(p: string) {
  const map: Record<string, string> = {
    whatsapp: '#25D366', instagram: '#E1306C', tiktok: '#ff0050', facebook: '#1877F2',
  }
  return map[p?.toLowerCase()] ?? '#8729A0'
}
function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n)
}

// ── types ─────────────────────────────────────────────────────────────────────
const FILTER_TABS = ['All', 'Open', 'AI Handling', 'Human', 'Resolved'] as const
const PLATFORMS   = ['All', 'WhatsApp', 'Instagram', 'TikTok', 'Facebook'] as const
type FilterTab     = typeof FILTER_TABS[number]
type PlatformFilter = typeof PLATFORMS[number]

interface Props {
  conversations: Conversation[]
  counts: ConvFilterCounts
}

// ── main component ─────────────────────────────────────────────────────────────
export default function ConversationsView({ conversations: initial, counts }: Props) {
  const [conversations, setConversations] = useState<Conversation[]>(initial)
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<FilterTab>('All')
  const [platform, setPlatform] = useState<PlatformFilter>('All')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // filter conversations
  const filtered = conversations.filter((c) => {
    const name = (c.contact?.name ?? '').toLowerCase()
    const msg  = (c.last_message ?? '').toLowerCase()
    const q    = search.toLowerCase()
    if (q && !name.includes(q) && !msg.includes(q)) return false
    if (tab === 'Open'        && c.status !== 'open')                             return false
    if (tab === 'Resolved'    && c.status !== 'resolved')                         return false
    if (tab === 'AI Handling' && !c.is_ai_handling)                               return false
    if (tab === 'Human'       && (c.is_ai_handling || c.status === 'resolved'))   return false
    if (platform !== 'All'    && c.platform !== platform.toLowerCase())           return false
    return true
  })

  const selected = conversations.find((c) => c.id === selectedId) ?? null
  const totalUnread = conversations.reduce((acc, c) => acc + c.unread_count, 0)

  // load messages on select
  useEffect(() => {
    if (!selectedId) return
    setLoadingMsgs(true)
    setMessages([])
    const sb = createClient()
    sb.from('messages')
      .select('*')
      .eq('conversation_id', selectedId)
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (error) toast.error('Could not load messages')
        setMessages((data ?? []) as Message[])
        setLoadingMsgs(false)
      })
  }, [selectedId])

  // auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // send message
  const handleSend = async () => {
    if (!reply.trim() || !selectedId || sending) return
    const text = reply.trim()
    setSending(true)
    const optimistic: Message = {
      id: `opt-${Date.now()}`,
      created_at: new Date().toISOString(),
      conversation_id: selectedId,
      content: text,
      sender_type: 'business',
    }
    setMessages((prev) => [...prev, optimistic])
    setReply('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    const sb = createClient()
    const { error } = await sb.from('messages')
      .insert({ conversation_id: selectedId, content: text, sender_type: 'business' })
    if (error) {
      toast.error('Failed to send message')
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id))
      setReply(text)
    } else {
      await sb.from('conversations').update({ last_message: text, last_message_at: new Date().toISOString() }).eq('id', selectedId)
      setConversations((prev) => prev.map((c) => c.id === selectedId ? { ...c, last_message: text } : c))
    }
    setSending(false)
  }

  // toggle AI handling
  const toggleAI = async (conv: Conversation) => {
    const next = !conv.is_ai_handling
    setConversations((prev) => prev.map((c) => c.id === conv.id ? { ...c, is_ai_handling: next } : c))
    const sb = createClient()
    const { error } = await sb.from('conversations').update({ is_ai_handling: next }).eq('id', conv.id)
    if (error) {
      toast.error('Failed to update AI handling')
      setConversations((prev) => prev.map((c) => c.id === conv.id ? { ...c, is_ai_handling: !next } : c))
    } else {
      toast.success(next ? 'AI handling enabled' : 'You have taken over this conversation')
    }
  }

  const tabCount: Record<FilterTab, number> = {
    All:         counts.all,
    Open:        counts.open,
    'AI Handling': counts.ai_handling,
    Human:       counts.human,
    Resolved:    counts.resolved,
  }

  return (
    <div className="flex h-[calc(100vh-96px)] -mx-8 -mb-8 overflow-hidden">
      {/* ── LEFT PANEL ────────────────────────────────────────────────── */}
      <div
        className={`flex flex-col w-full lg:w-[380px] flex-shrink-0 border-r border-[#1a2400] bg-[#0A1200]
          ${selectedId ? 'hidden lg:flex' : 'flex'}`}
      >
        {/* header */}
        <div className="px-4 pt-4 pb-3 border-b border-[#1a2400]">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-[#E4F0F6] font-semibold text-base">Conversations</h2>
            {totalUnread > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-[#8729A0] text-white text-[10px] font-bold">
                {totalUnread}
              </span>
            )}
          </div>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8892A4]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations…"
              className="w-full bg-[#111111] border border-[#1a2400] rounded-lg pl-8 pr-3 py-2 text-[13px] text-[#E4F0F6] placeholder:text-[#8892A4] outline-none focus:border-[#8729A0]/50"
            />
          </div>
        </div>

        {/* filter tabs */}
        <div className="flex gap-0.5 px-3 py-2 border-b border-[#1a2400] overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {FILTER_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                tab === t ? 'bg-[#8729A0] text-white' : 'text-[#8892A4] hover:text-[#E4F0F6] hover:bg-white/[0.04]'
              }`}
            >
              {t}
              <span className={`text-[10px] ${tab === t ? 'text-white/70' : 'text-[#8892A4]'}`}>
                {tabCount[t]}
              </span>
            </button>
          ))}
        </div>

        {/* platform pills */}
        <div className="flex gap-1 px-3 py-2 border-b border-[#1a2400] overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {PLATFORMS.map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap transition-all border ${
                platform === p
                  ? 'border-[#8729A0]/60 text-[#E4F0F6] bg-[#8729A0]/10'
                  : 'border-transparent text-[#8892A4] hover:text-[#E4F0F6]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 h-40 text-[#8892A4]">
              <MessageSquare size={28} strokeWidth={1} />
              <p className="text-sm">No conversations</p>
            </div>
          ) : (
            filtered.map((conv) => {
              const name  = conv.contact?.name ?? 'Unknown'
              const color = platformColor(conv.platform)
              const active = conv.id === selectedId
              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedId(conv.id)}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3.5 border-b border-[#1a2400]/60 transition-all
                    ${active
                      ? 'border-l-2 border-l-[#8729A0] bg-[#8729A008] pl-[14px]'
                      : 'hover:bg-[#ffffff04]'}`}
                >
                  <div
                    className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[11px] font-bold"
                    style={{ background: `linear-gradient(135deg, ${color}aa, ${color}44)` }}
                  >
                    {getInitials(name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[#E4F0F6] text-[13px] font-semibold truncate">{name}</span>
                      <span className="text-[#8892A4] text-[10px] flex-shrink-0">{timeAgo(conv.last_message_at ?? conv.created_at)}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5 gap-1">
                      <span className="text-[#8892A4] text-[12px] truncate">{conv.last_message ?? 'No messages yet'}</span>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {conv.is_ai_handling && (
                          <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-[#00D97E]/15 text-[#00D97E]">AI</span>
                        )}
                        {conv.unread_count > 0 && (
                          <span className="w-4 h-4 rounded-full bg-[#8729A0] flex items-center justify-center text-[9px] text-white font-bold">
                            {conv.unread_count > 9 ? '9+' : conv.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* ── RIGHT PANEL ───────────────────────────────────────────────── */}
      <div className={`flex-1 flex overflow-hidden bg-[#111111] ${selectedId ? 'flex' : 'hidden lg:flex'}`}>
        {!selected ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-[#8892A4]">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <rect width="64" height="64" rx="16" fill="#1a2400"/>
              <path d="M20 22h24M20 30h16M20 38h20" stroke="#8892A4" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="48" cy="44" r="10" fill="#0A1200" stroke="#1a2400" strokeWidth="2"/>
              <path d="M44 44h8M48 40v8" stroke="#8729A0" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p className="text-sm">Select a conversation to start</p>
          </div>
        ) : (
          <>
            {/* ── Detail column ── */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* header */}
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[#1a2400] bg-[#0A1200] flex-shrink-0">
                <button
                  onClick={() => setSelectedId(null)}
                  className="lg:hidden p-1 text-[#8892A4] hover:text-[#E4F0F6]"
                >
                  <ArrowLeft size={17} />
                </button>
                <div
                  className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[11px] font-bold"
                  style={{ background: `linear-gradient(135deg, ${platformColor(selected.platform)}aa, ${platformColor(selected.platform)}44)` }}
                >
                  {getInitials(selected.contact?.name ?? 'U')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#E4F0F6] text-sm font-semibold truncate">{selected.contact?.name ?? 'Unknown'}</p>
                  <p className="text-[#8892A4] text-[11px] capitalize">{selected.platform}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* AI toggle */}
                  <button
                    onClick={() => toggleAI(selected)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-all ${
                      selected.is_ai_handling
                        ? 'border-[#00D97E]/40 bg-[#00D97E]/10 text-[#00D97E]'
                        : 'border-[#1a2400] bg-transparent text-[#8892A4] hover:text-[#E4F0F6]'
                    }`}
                  >
                    <Bot size={12} />
                    {selected.is_ai_handling ? 'AI On' : 'AI Off'}
                  </button>
                  <button
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="p-1.5 rounded-lg text-[#8892A4] hover:text-[#E4F0F6] hover:bg-white/[0.04] transition-all"
                  >
                    <ChevronRight size={16} className={`transition-transform ${showSidebar ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              {/* messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {loadingMsgs ? (
                  <div className="space-y-4">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className={`flex ${i % 2 ? 'justify-end' : 'justify-start'}`}>
                        <div className="h-10 rounded-2xl bg-[#1a2400] animate-pulse" style={{ width: `${140 + i * 30}px` }} />
                      </div>
                    ))}
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-[#8892A4] text-sm">
                    No messages yet — start the conversation!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const outbound = msg.sender_type === 'business' || msg.sender_type === 'ai'
                    return (
                      <div key={msg.id} className={`flex ${outbound ? 'justify-end' : 'justify-start'}`}>
                        <div className="max-w-[70%]">
                          <div
                            className={`px-4 py-2.5 text-sm leading-relaxed ${outbound
                              ? 'text-white rounded-[16px_4px_16px_16px]'
                              : 'text-[#E4F0F6] bg-[#1a2400] rounded-[4px_16px_16px_16px]'}`}
                            style={outbound ? { background: 'linear-gradient(135deg, #8729A0, #6a1f80)' } : {}}
                          >
                            {msg.content}
                          </div>
                          <p className={`text-[10px] text-[#8892A4] mt-1 ${outbound ? 'text-right' : ''}`}>
                            {fmtTime(msg.created_at)}
                            {msg.sender_type === 'ai' && ' · AI'}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* AI banner or reply input */}
              {selected.is_ai_handling ? (
                <div className="flex items-center justify-between gap-3 px-5 py-3 bg-[#00D97E]/05 border-t border-[#00D97E]/20 flex-shrink-0">
                  <div className="flex items-center gap-2 text-[#00D97E] text-sm">
                    <Bot size={14} />
                    <span>AI is handling this conversation</span>
                  </div>
                  <button
                    onClick={() => toggleAI(selected)}
                    className="px-3 py-1.5 rounded-lg bg-[#8729A0] text-white text-xs font-semibold hover:bg-[#6a1f80] transition-colors"
                  >
                    Take Over
                  </button>
                </div>
              ) : (
                <div className="flex items-end gap-3 px-4 py-3 border-t border-[#1a2400] bg-[#0A1200] flex-shrink-0">
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={reply}
                    onChange={(e) => {
                      setReply(e.target.value)
                      e.target.style.height = 'auto'
                      e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
                    }}
                    placeholder="Type a message… (Enter to send)"
                    className="flex-1 bg-[#111111] border border-[#1a2400] rounded-xl px-4 py-2.5 text-sm text-[#E4F0F6] placeholder:text-[#8892A4] outline-none focus:border-[#8729A0]/50 resize-none overflow-hidden"
                  />
                  <button
                    onClick={handleSend}
                    disabled={sending || !reply.trim()}
                    className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl text-white transition-all disabled:opacity-40"
                    style={{ background: 'linear-gradient(135deg, #8729A0, #6a1f80)' }}
                  >
                    <Send size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* ── Contact info sidebar ── */}
            {showSidebar && selected.contact && (
              <div className="w-[240px] flex-shrink-0 border-l border-[#1a2400] bg-[#0A1200] overflow-y-auto p-4 space-y-4">
                <div className="text-center">
                  <div
                    className="w-12 h-12 rounded-full mx-auto flex items-center justify-center text-white font-bold"
                    style={{ background: `linear-gradient(135deg, ${platformColor(selected.platform)}aa, ${platformColor(selected.platform)}44)` }}
                  >
                    {getInitials(selected.contact.name ?? 'U')}
                  </div>
                  <p className="text-[#E4F0F6] font-semibold text-sm mt-2">{selected.contact.name}</p>
                  <p className="text-[#8892A4] text-[11px] capitalize mt-0.5">{selected.platform}</p>
                </div>
                <div className="space-y-2 text-[12px]">
                  {selected.contact.phone && (
                    <div className="flex items-center gap-2 text-[#8892A4]">
                      <Phone size={12} /> <span>{selected.contact.phone}</span>
                    </div>
                  )}
                  {selected.contact.email && (
                    <div className="flex items-center gap-2 text-[#8892A4]">
                      <Mail size={12} /> <span className="truncate">{selected.contact.email}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2 pt-2 border-t border-[#1a2400]">
                  <div className="flex justify-between text-[12px]">
                    <span className="text-[#8892A4]">Orders</span>
                    <span className="text-[#E4F0F6] font-semibold">{selected.contact.total_orders ?? 0}</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span className="text-[#8892A4]">Spent</span>
                    <span className="text-[#E4F0F6] font-semibold">{formatCurrency(selected.contact.total_spent ?? 0)}</span>
                  </div>
                  {selected.contact.last_active && (
                    <div className="flex justify-between text-[12px]">
                      <span className="text-[#8892A4]">Last active</span>
                      <span className="text-[#E4F0F6]">{timeAgo(selected.contact.last_active)} ago</span>
                    </div>
                  )}
                </div>
                {selected.contact.tags && selected.contact.tags.length > 0 && (
                  <div className="pt-2 border-t border-[#1a2400]">
                    <p className="text-[#8892A4] text-[11px] mb-2 flex items-center gap-1"><Tag size={10} /> Tags</p>
                    <div className="flex flex-wrap gap-1">
                      {selected.contact.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-full bg-[#1a2400] text-[#8892A4] text-[10px]">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
                <ShoppingBag size={12} className="text-[#8892A4] mx-auto mt-2" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
