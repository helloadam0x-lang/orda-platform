'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatWidgetProps {
  slug: string
  businessName: string
  accentColor?: string
}

export function ChatWidget({ slug, businessName, accentColor = '#D4A853' }: ChatWidgetProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const res = await fetch('/api/store/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, message: userMsg, history }),
      })

      let reply = ''
      const reader = res.body?.getReader()
      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = new TextDecoder().decode(value)
          const lines = chunk.split('\n').filter(l => l.startsWith('data: '))
          for (const line of lines) {
            const text = line.replace('data: ', '').trim()
            if (text && text !== '[DONE]') reply += text
          }
        }
      }

      const aiReply = reply || 'Sorry, I could not respond right now.'
      setMessages(prev => [...prev, { role: 'assistant', content: aiReply }])
      setHistory(prev => [
        ...prev,
        { role: 'user', parts: [{ text: userMsg }] },
        { role: 'model', parts: [{ text: aiReply }] },
      ])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }])
    }
    setLoading(false)
  }

  return (
    <>
      {/* Chat window */}
      {open && (
        <div
          style={{
            position: 'fixed', bottom: 90, right: 20, width: 340, maxHeight: '70vh',
            background: '#fff', borderRadius: 20, boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
            display: 'flex', flexDirection: 'column', zIndex: 9999,
            fontFamily: "'DM Sans', sans-serif",
            border: '1px solid rgba(0,0,0,0.08)',
          }}
        >
          {/* Header */}
          <div style={{ background: accentColor, padding: '14px 16px', borderRadius: '20px 20px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={16} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{businessName} AI</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>Always here to help</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.8)', padding: 4 }}>
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10, minHeight: 200, maxHeight: '50vh' }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: '#999', fontSize: 13, marginTop: 20 }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>👋</div>
                Hi! Ask me about products, prices, or place an order.
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '82%', padding: '10px 13px', fontSize: 13, lineHeight: 1.5, borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
                  background: m.role === 'user' ? accentColor : '#f5f5f5',
                  color: m.role === 'user' ? '#fff' : '#111',
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '10px 14px', background: '#f5f5f5', borderRadius: '4px 18px 18px 18px', fontSize: 13, color: '#999' }}>
                  <span style={{ display: 'inline-block', animation: 'pulse 1s infinite' }}>Typing…</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(0,0,0,0.07)', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Type a message…"
              style={{ flex: 1, border: '1px solid rgba(0,0,0,0.12)', borderRadius: 10, padding: '8px 12px', fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              style={{ width: 36, height: 36, borderRadius: 10, background: accentColor, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: !input.trim() || loading ? 0.5 : 1 }}
            >
              <Send size={15} color="#fff" />
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 20, right: 20,
          width: 56, height: 56, borderRadius: '50%',
          background: accentColor, border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)', zIndex: 9999,
          transition: 'transform 200ms cubic-bezier(0.23,1,0.32,1)',
        }}
        onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.92)' }}
        onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
      >
        {open ? <X size={22} color="#fff" /> : <MessageCircle size={22} color="#fff" />}
      </button>
    </>
  )
}
