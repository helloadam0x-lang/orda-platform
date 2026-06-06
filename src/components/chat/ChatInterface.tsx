'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, X, MessageCircle, Loader2 } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  businessId: string
  businessName: string
  greeting: string
  accentColor?: string
}

export default function ChatInterface({
  businessId,
  businessName,
  greeting,
  accentColor = '#8729A0',
}: ChatInterfaceProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId] = useState(() => crypto.randomUUID())
  const [visitorName, setVisitorName] = useState('')
  const [nameStep, setNameStep] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && messages.length === 0 && !nameStep) {
      setMessages([{
        id: crypto.randomUUID(),
        role: 'assistant',
        content: greeting,
        timestamp: new Date(),
      }])
    }
  }, [open, greeting, messages.length, nameStep])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open, nameStep])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
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
          message: text.trim(),
          visitor_name: visitorName,
        }),
      })

      if (!res.ok) throw new Error('Request failed')
      const data = await res.json()

      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.response ?? 'Sorry, something went wrong.',
        timestamp: new Date(),
      }])
    } catch {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      }])
    } finally {
      setLoading(false)
    }
  }, [loading, sessionId, businessId, visitorName])

  const handleNameSubmit = () => {
    const name = visitorName.trim() || 'Guest'
    setVisitorName(name)
    setNameStep(false)
    setMessages([{
      id: crypto.randomUUID(),
      role: 'assistant',
      content: greeting,
      timestamp: new Date(),
    }])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (nameStep) handleNameSubmit()
      else sendMessage(input)
    }
  }

  const formatTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <>
      {/* Launcher button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Open chat"
        style={{ backgroundColor: accentColor }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 cubic-bezier-smooth active:scale-95"
      >
        {open
          ? <X className="w-6 h-6 text-white" />
          : <MessageCircle className="w-6 h-6 text-white" />
        }
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-8rem)] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
            style={{ backgroundColor: accentColor }}
          >
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-white text-sm truncate">{businessName}</p>
              <p className="text-white/70 text-xs">Powered by Orda AI</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin">
            {nameStep ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${accentColor}22` }}
                >
                  <MessageCircle className="w-7 h-7" style={{ color: accentColor }} />
                </div>
                <p className="text-white/80 text-sm">
                  Welcome! What&apos;s your name so we can assist you better?
                </p>
                <input
                  ref={inputRef}
                  type="text"
                  value={visitorName}
                  onChange={e => setVisitorName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Your name (optional)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm outline-none focus:border-white/30 transition-colors"
                />
                <button
                  onClick={handleNameSubmit}
                  style={{ backgroundColor: accentColor }}
                  className="w-full py-2.5 rounded-xl text-white text-sm font-medium transition-transform active:scale-95"
                >
                  Start Chat
                </button>
              </div>
            ) : (
              <>
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className="max-w-[80%] rounded-2xl px-3.5 py-2.5"
                      style={
                        msg.role === 'user'
                          ? { backgroundColor: accentColor, color: '#fff' }
                          : { backgroundColor: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.9)' }
                      }
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      <p className="text-[10px] mt-1 opacity-50 text-right">{formatTime(msg.timestamp)}</p>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div
                      className="rounded-2xl px-4 py-3"
                      style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
                    >
                      <Loader2 className="w-4 h-4 animate-spin text-white/50" />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </>
            )}
          </div>

          {/* Input */}
          {!nameStep && (
            <div className="flex-shrink-0 px-3 py-3 border-t border-white/5">
              <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message…"
                  disabled={loading}
                  className="flex-1 bg-transparent text-white placeholder-white/30 text-sm outline-none disabled:opacity-50"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={loading || !input.trim()}
                  style={{ backgroundColor: input.trim() ? accentColor : 'transparent' }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-95 disabled:opacity-30"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
              <p className="text-center text-white/20 text-[10px] mt-1.5">Powered by Orda</p>
            </div>
          )}
        </div>
      )}
    </>
  )
}
