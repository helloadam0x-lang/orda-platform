'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Send, ShoppingBag, CheckCircle, X } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  ts: string
  orderData?: OrderPayload | null
}

interface OrderPayload {
  items: Array<{ name: string; quantity: number; price: number }>
  total: number
  delivery_address: string
}

interface Props {
  businessId: string
  businessName: string
  greeting: string
  accentColor: string
}

function fmtTime(ts: string) {
  try { return new Date(ts).toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit', hour12: true }) } catch { return '' }
}

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

const QUICK_REPLIES = ['View Products', 'Place an Order', 'Contact Us']

export default function ChatInterface({ businessId, businessName, greeting, accentColor }: Props) {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [visitorName, setVisitorName] = useState<string | null>(null)
  const [showNameCard, setShowNameCard] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [pendingMessage, setPendingMessage] = useState<string | null>(null)
  const [orderConfirm, setOrderConfirm] = useState<{ order: OrderPayload; msgId: string } | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [handoff, setHandoff] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, loading, scrollToBottom])

  // Create session on mount
  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('chat_sessions')
      .insert({ business_id: businessId, platform: 'web' })
      .select('id')
      .single()
      .then(({ data }) => {
        if (data) setSessionId(data.id)
      })
  }, [businessId])

  // Realtime: listen for new assistant messages (business replies from dashboard)
  useEffect(() => {
    if (!sessionId) return
    const supabase = createClient()
    const channel = supabase
      .channel(`chat:${sessionId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${sessionId}` },
        (payload) => {
          const row = payload.new as { id: string; role: string; content: string; is_ai: boolean; created_at: string }
          // Only add if it's a human reply from dashboard (role='assistant' but not from our own AI send)
          if (row.role === 'assistant' && !loading) {
            setMessages(prev => {
              if (prev.find(m => m.id === row.id)) return prev
              return [...prev, { id: row.id, role: 'assistant', content: row.content, ts: row.created_at }]
            })
          }
        }
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [sessionId, loading])

  const sendMessage = useCallback(async (text: string, name?: string) => {
    if (!text.trim() || !sessionId) return
    const effectiveName = name ?? visitorName

    // Optimistic user message
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      ts: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          business_id: businessId,
          message: text,
          visitor_name: effectiveName,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed')

      const aiMsg: Message = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        ts: new Date().toISOString(),
        orderData: data.order ? null : undefined,
      }

      // If order payload detected in response, show confirm card
      if (data.order) {
        aiMsg.orderData = data.order as OrderPayload
        setOrderConfirm({ order: data.order as OrderPayload, msgId: aiMsg.id })
      }

      if (data.handoff) {
        setHandoff(true)
      }

      setMessages(prev => [...prev, aiMsg])
    } catch {
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
        ts: new Date().toISOString(),
      }])
    } finally {
      setLoading(false)
    }
  }, [sessionId, visitorName, businessId])

  const handleSend = () => {
    if (!input.trim() || loading) return
    const text = input.trim()

    if (!visitorName && messages.length === 0) {
      setPendingMessage(text)
      setShowNameCard(true)
      setMessages(prev => [...prev, { id: `u-${Date.now()}`, role: 'user', content: text, ts: new Date().toISOString() }])
      setInput('')
      return
    }
    sendMessage(text)
  }

  const handleNameSubmit = () => {
    const name = nameInput.trim() || 'Guest'
    setVisitorName(name)
    setShowNameCard(false)
    // Update session with name
    if (sessionId) {
      const supabase = createClient()
      supabase.from('chat_sessions').update({ visitor_name: name }).eq('id', sessionId).then(() => {})
    }
    if (pendingMessage) {
      sendMessage(pendingMessage, name)
      setPendingMessage(null)
    }
    setNameInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const isWelcome = messages.length === 0

  return (
    <div className="flex flex-col h-[100dvh] bg-[#111111] overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-[#0A1200] border-b border-[#1a2400]">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${accentColor}cc, ${accentColor}66)` }}
        >
          {getInitials(businessName)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[#E4F0F6] font-bold text-[15px] leading-tight truncate" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {businessName}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-[#00D97E] animate-pulse" />
            <span className="text-[#8892A4] text-[11px]">Online</span>
          </div>
        </div>
        <a
          href="https://orda.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#8892A4] text-[9px] font-medium hover:text-[#E4F0F6] transition-colors"
        >
          Powered by Orda
        </a>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {isWelcome ? (
          <div className="flex flex-col items-center justify-center gap-5 py-8 text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg"
              style={{ background: `linear-gradient(135deg, ${accentColor}cc, ${accentColor}44)` }}
            >
              {getInitials(businessName)}
            </div>
            <div>
              <p className="text-[#E4F0F6] font-bold text-lg mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{businessName}</p>
              <p className="text-[#8892A4] text-sm max-w-xs mx-auto leading-relaxed">{greeting}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 w-full max-w-sm">
              {QUICK_REPLIES.map(qr => (
                <button
                  key={qr}
                  onClick={() => sendMessage(qr)}
                  className="px-4 py-2 rounded-full border border-[#1a2400] text-[#E4F0F6] text-sm font-medium hover:border-opacity-60 transition-all active:scale-95"
                  style={{ borderColor: `${accentColor}66`, background: `${accentColor}12` }}
                >
                  {qr}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${msg.role === 'user' ? '' : 'space-y-2'}`}>
                <div
                  className={`px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'text-white rounded-[18px_18px_4px_18px]'
                      : 'text-[#E4F0F6] bg-[#0A1200] border border-[#1a2400] rounded-[18px_18px_18px_4px]'
                  }`}
                  style={msg.role === 'user' ? { background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)` } : {}}
                >
                  {msg.content}
                </div>
                <p className={`text-[10px] text-[#8892A4] mt-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                  {fmtTime(msg.ts)}
                </p>
              </div>
            </div>
          ))
        )}

        {/* Typing indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-3 bg-[#0A1200] border border-[#1a2400] rounded-[18px_18px_18px_4px] flex items-center gap-1.5">
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full bg-[#8892A4] animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Name collection card */}
        {showNameCard && (
          <div className="flex justify-start">
            <div className="w-full max-w-[85%] bg-[#0A1200] border border-[#1a2400] rounded-2xl p-4 space-y-3">
              <p className="text-[#E4F0F6] text-sm font-medium">What&#39;s your name? 👋</p>
              <div className="flex gap-2">
                <input
                  autoFocus
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleNameSubmit()}
                  placeholder="Your name…"
                  className="flex-1 bg-[#111111] border border-[#1a2400] rounded-lg px-3 py-2 text-sm text-[#E4F0F6] placeholder:text-[#8892A4] outline-none"
                />
                <button
                  onClick={handleNameSubmit}
                  className="px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all active:scale-95"
                  style={{ background: accentColor }}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Order confirmation card */}
        {orderConfirm && (
          <div className="flex justify-start">
            <div className="w-full max-w-[90%] bg-[#0f1a00] border border-[#1a2400] rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <ShoppingBag size={16} style={{ color: accentColor }} />
                <p className="text-[#E4F0F6] font-semibold text-sm">Order Summary</p>
              </div>
              <div className="space-y-1.5">
                {orderConfirm.order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-[#8892A4]">{item.name} × {item.quantity}</span>
                    <span className="text-[#E4F0F6] font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-[#1a2400] pt-1.5 flex justify-between">
                  <span className="text-[#E4F0F6] font-semibold text-sm">Total</span>
                  <span className="font-bold text-sm" style={{ color: accentColor }}>${orderConfirm.order.total.toFixed(2)}</span>
                </div>
                {orderConfirm.order.delivery_address && (
                  <p className="text-[#8892A4] text-[11px]">📍 {orderConfirm.order.delivery_address}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setOrderConfirm(null); setShowPayment(true) }}
                  className="flex-1 py-2 rounded-xl text-white text-sm font-semibold transition-all active:scale-95"
                  style={{ background: accentColor }}
                >
                  Confirm Order
                </button>
                <button
                  onClick={() => setOrderConfirm(null)}
                  className="px-3 py-2 rounded-xl border border-[#1a2400] text-[#8892A4] text-sm hover:text-[#E4F0F6] transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment options */}
        {showPayment && (
          <div className="flex justify-start">
            <div className="w-full max-w-[90%] bg-[#0f1a00] border border-[#1a2400] rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-[#00D97E]" />
                <p className="text-[#E4F0F6] font-semibold text-sm">Order Confirmed! Choose payment</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: 'MTN MoMo', color: '#FFCC00', emoji: '🟡' },
                  { name: 'Airtel Money', color: '#FF0000', emoji: '🔴' },
                  { name: 'Card', color: '#1877F2', emoji: '💳' },
                ].map(pm => (
                  <button
                    key={pm.name}
                    onClick={() => {
                      setShowPayment(false)
                      setMessages(prev => [...prev, {
                        id: `sys-${Date.now()}`,
                        role: 'assistant',
                        content: `You selected ${pm.name}. A payment link will be sent to you shortly. Our team will confirm your order.`,
                        ts: new Date().toISOString(),
                      }])
                    }}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-[#1a2400] hover:border-[#8892A4]/30 transition-all active:scale-95"
                  >
                    <span className="text-xl">{pm.emoji}</span>
                    <span className="text-[#E4F0F6] text-[11px] font-medium text-center leading-tight">{pm.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Handoff notice */}
        {handoff && (
          <div className="flex justify-center">
            <div className="px-4 py-2 rounded-full bg-[#0A1200] border border-[#1a2400] text-[#8892A4] text-[11px] text-center">
              Connecting you with the team…
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 bg-[#0A1200] border-t border-[#1a2400] px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            disabled={loading || showNameCard}
            className="flex-1 bg-[#111111] border border-[#1a2400] rounded-full px-4 py-2.5 text-sm text-[#E4F0F6] placeholder:text-[#8892A4] outline-none focus:border-opacity-60 transition-all disabled:opacity-50"
            style={{ '--tw-border-opacity': '1' } as React.CSSProperties}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim() || showNameCard}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0 disabled:opacity-40 transition-all active:scale-90"
            style={{ background: accentColor }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
