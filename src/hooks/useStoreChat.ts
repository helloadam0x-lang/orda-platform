'use client'

import { useState, useCallback, useRef } from 'react'

export interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: Date
}

export function useStoreChat(slug: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [sending, setSending] = useState(false)
  const [open, setOpen] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(async (text: string, customerPhone?: string) => {
    if (!text.trim() || sending) return

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setSending(true)

    const aiMsgId = crypto.randomUUID()
    setMessages(prev => [...prev, { id: aiMsgId, role: 'ai', content: '', timestamp: new Date() }])

    try {
      abortRef.current = new AbortController()
      const res = await fetch('/api/store/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, message: text.trim(), phone: customerPhone }),
        signal: abortRef.current.signal,
      })

      if (!res.ok || !res.body) throw new Error('Failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const payload = line.slice(6)
            if (payload === '[DONE]') break
            try {
              const { text: t } = JSON.parse(payload)
              if (t) {
                accumulated += t
                setMessages(prev => prev.map(m =>
                  m.id === aiMsgId ? { ...m, content: accumulated } : m
                ))
              }
            } catch { /* skip malformed */ }
          }
        }
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        setMessages(prev => prev.map(m =>
          m.id === aiMsgId ? { ...m, content: "Sorry, I couldn't respond. Please try again." } : m
        ))
      }
    } finally {
      setSending(false)
    }
  }, [slug, sending])

  const clearMessages = useCallback(() => setMessages([]), [])

  return { messages, sending, open, setOpen, sendMessage, clearMessages }
}
