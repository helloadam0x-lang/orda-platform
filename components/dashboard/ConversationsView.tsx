'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Bot, UserCheck, Send, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getInitials, timeAgo, platformColor, statusColor } from '@/lib/utils'
import type { Conversation, Message } from '@/types/database'

const FILTER_TABS = ['All', 'Open', 'Resolved', 'AI Handling'] as const
const PLATFORMS = ['All', 'WhatsApp', 'Instagram', 'TikTok', 'Facebook'] as const

type FilterTab = (typeof FILTER_TABS)[number]
type PlatformFilter = (typeof PLATFORMS)[number]

interface Props {
  conversations: Conversation[]
}

export default function ConversationsView({ conversations }: Props) {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<FilterTab>('All')
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>('All')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const filtered = conversations.filter((c) => {
    const name = c.contact?.name ?? ''
    if (search && !name.toLowerCase().includes(search.toLowerCase()) &&
      !(c.last_message ?? '').toLowerCase().includes(search.toLowerCase())) return false
    if (tab === 'Open' && c.status !== 'open') return false
    if (tab === 'Resolved' && c.status !== 'resolved') return false
    if (tab === 'AI Handling' && !c.is_ai_handling) return false
    if (platformFilter !== 'All' && c.platform !== platformFilter.toLowerCase()) return false
    return true
  })

  const selected = conversations.find((c) => c.id === selectedId) ?? null

  useEffect(() => {
    if (!selectedId) return
    setLoadingMsgs(true)
    const supabase = createClient()
    supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', selectedId)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setMessages((data ?? []) as Message[])
        setLoadingMsgs(false)
      })
  }, [selectedId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!reply.trim() || !selectedId) return
    setSending(true)
    const supabase = createClient()
    const { data: msg } = await supabase
      .from('messages')
      .insert({ conversation_id: selectedId, content: reply.trim(), sender_type: 'business' })
      .select()
      .single()
    if (msg) setMessages((prev) => [...prev, msg as Message])
    await supabase
      .from('conversations')
      .update({ last_message: reply.trim() })
      .eq('id', selectedId)
    setReply('')
    setSending(false)
  }

  const handleTakeover = async () => {
    if (!selectedId) return
    const supabase = createClient()
    await supabase.from('conversations').update({ is_ai_handling: false }).eq('id', selectedId)
    window.location.reload()
  }

  return (
    <div className="flex h-[calc(100vh-128px)] gap-0 -m-5 lg:-m-8 overflow-hidden rounded-[14px] border border-orda-border">
      {/* Left: conversation list */}
      <div className={`flex flex-col w-full lg:w-[340px] flex-shrink-0 bg-orda-surface border-r border-orda-border ${selectedId ? 'hidden lg:flex' : 'flex'}`}>
        {/* Search */}
        <div className="p-3 border-b border-orda-border">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-orda-grey" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations…"
              className="w-full bg-orda-black border border-orda-border rounded-lg pl-8 pr-3 py-2 text-[13px] text-orda-light placeholder:text-orda-grey outline-none focus:border-orda-accent/50"
            />
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 px-3 py-2 border-b border-orda-border overflow-x-auto">
          {FILTER_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                tab === t
                  ? 'bg-orda-accent text-white'
                  : 'text-orda-grey hover:text-orda-light hover:bg-white/[0.04]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Platform filter */}
        <div className="flex gap-1 px-3 py-2 border-b border-orda-border overflow-x-auto">
          {PLATFORMS.map((p) => (
            <button
              key={p}
              onClick={() => setPlatformFilter(p)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap transition-all ${
                platformFilter === p
                  ? 'bg-orda-border text-orda-light'
                  : 'text-orda-grey hover:text-orda-light'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-orda-grey text-sm">
              No conversations found.
            </div>
          ) : (
            filtered.map((conv) => {
              const name = conv.contact?.name ?? 'Unknown'
              const color = platformColor(conv.contact?.platform ?? conv.platform)
              const isActive = conv.id === selectedId
              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedId(conv.id)}
                  className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer border-b border-orda-border/50 transition-colors ${
                    isActive ? 'bg-orda-accent/10' : 'hover:bg-white/[0.03]'
                  }`}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${color}99, ${color}44)` }}
                  >
                    {getInitials(name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="text-orda-light text-[13px] font-semibold truncate">{name}</span>
                      <span className="text-orda-grey text-[10px] flex-shrink-0 ml-1">{timeAgo(conv.created_at)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-0.5 gap-1">
                      <span className="text-orda-grey text-[12px] truncate">{conv.last_message ?? '—'}</span>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {conv.is_ai_handling && <Bot size={10} className="text-orda-accent" />}
                        {conv.unread_count > 0 && (
                          <span className="w-4 h-4 rounded-full bg-orda-accent flex items-center justify-center text-[9px] text-white font-bold">
                            {conv.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Right: conversation detail */}
      <div className={`flex-1 flex flex-col bg-orda-black ${selectedId ? 'flex' : 'hidden lg:flex'}`}>
        {!selected ? (
          <div className="flex-1 flex items-center justify-center text-orda-grey text-sm">
            Select a conversation to view messages.
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-orda-border bg-orda-surface">
              <button
                onClick={() => setSelectedId(null)}
                className="lg:hidden text-orda-grey hover:text-orda-light mr-1"
              >
                <ArrowLeft size={18} />
              </button>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${platformColor(selected.contact?.platform ?? selected.platform)}99, ${platformColor(selected.contact?.platform ?? selected.platform)}44)` }}
              >
                {getInitials(selected.contact?.name ?? 'U')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-orda-light text-sm font-semibold">{selected.contact?.name ?? 'Unknown'}</p>
                <p className="text-orda-grey text-[11px] capitalize">{selected.platform}</p>
              </div>
              <div className="flex items-center gap-2">
                {selected.is_ai_handling && (
                  <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-orda-accent/15 text-orda-accent text-[11px] font-semibold">
                    <Bot size={11} /> AI Handling
                  </span>
                )}
                <span
                  className="px-2 py-1 rounded-full text-[11px] font-semibold capitalize"
                  style={{ background: `${statusColor(selected.status)}20`, color: statusColor(selected.status) }}
                >
                  {selected.status}
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {loadingMsgs ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                      <div className="h-9 w-48 rounded-2xl bg-orda-border animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-orda-grey text-sm">
                  No messages yet.
                </div>
              ) : (
                messages.map((msg) => {
                  const isBusiness = msg.sender_type === 'business' || msg.sender_type === 'ai'
                  return (
                    <div key={msg.id} className={`flex ${isBusiness ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          isBusiness
                            ? 'bg-orda-accent text-white rounded-br-sm'
                            : 'bg-orda-border text-orda-light rounded-bl-sm'
                        }`}
                      >
                        {msg.content}
                        <div className={`text-[10px] mt-1 ${isBusiness ? 'text-white/60' : 'text-orda-grey'}`}>
                          {timeAgo(msg.created_at)}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* AI takeover banner or reply input */}
            {selected.is_ai_handling ? (
              <div className="flex items-center justify-between gap-3 px-5 py-3 bg-orda-accent/10 border-t border-orda-accent/20">
                <div className="flex items-center gap-2 text-orda-accent text-sm">
                  <Bot size={15} />
                  <span>AI is handling this conversation</span>
                </div>
                <button
                  onClick={handleTakeover}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orda-accent text-white text-xs font-semibold hover:bg-[#6a1f80] transition-colors"
                >
                  <UserCheck size={13} />
                  Take over
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 px-4 py-3 border-t border-orda-border bg-orda-surface">
                <input
                  type="text"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder="Type a reply…"
                  className="flex-1 bg-orda-black border border-orda-border rounded-lg px-4 py-2.5 text-sm text-orda-light placeholder:text-orda-grey outline-none focus:border-orda-accent/50"
                />
                <button
                  onClick={handleSend}
                  disabled={sending || !reply.trim()}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-orda-accent text-white hover:bg-[#6a1f80] disabled:opacity-40 transition-all"
                >
                  <Send size={15} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
