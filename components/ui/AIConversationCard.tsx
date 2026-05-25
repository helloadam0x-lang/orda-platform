'use client'

import { useEffect, useState, useCallback } from 'react'

const messages = [
  { role: 'customer', text: 'Hi! Do you still have the black sneakers in size 42?', delay: 0 },
  { role: 'ai', text: 'Yes! We have 3 pairs left in size 42. Want me to reserve one for you?', delay: 1400 },
  { role: 'customer', text: 'Yes please! How much?', delay: 2900 },
  { role: 'ai', text: '₦89,000 with free delivery. I\'ll send the payment link now. 🎉', delay: 4200 },
]

export default function AIConversationCard() {
  const [visibleCount, setVisibleCount] = useState(0)
  const [showTyping, setShowTyping] = useState(false)

  const runAnimation = useCallback(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    messages.forEach((msg, i) => {
      if (msg.role === 'ai') {
        timers.push(setTimeout(() => setShowTyping(true), msg.delay))
        timers.push(setTimeout(() => {
          setShowTyping(false)
          setVisibleCount(i + 1)
        }, msg.delay + 800))
      } else {
        timers.push(setTimeout(() => setVisibleCount(i + 1), msg.delay))
      }
    })

    return timers
  }, [])

  useEffect(() => {
    let timers = runAnimation()
    const interval = setInterval(() => {
      timers.forEach(clearTimeout)
      setVisibleCount(0)
      setShowTyping(false)
      setTimeout(() => {
        timers = runAnimation()
      }, 400)
    }, 9000)

    return () => {
      timers.forEach(clearTimeout)
      clearInterval(interval)
    }
  }, [runAnimation])

  return (
    <div className="glass-card rounded-2xl p-5 w-full max-w-sm shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-white text-xs font-bold">
            AI
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-background" />
        </div>
        <div>
          <div className="text-sm font-semibold text-text-primary">Orda AI Agent</div>
          <div className="text-xs text-green-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            Active · Replying instantly
          </div>
        </div>
        <div className="ml-auto">
          <svg viewBox="0 0 24 24" className="w-5 h-5" style={{ fill: '#25D366' }} xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-3 min-h-[140px]">
        {messages.slice(0, visibleCount).map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'customer' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-3.5 py-2.5 rounded-2xl text-xs max-w-[85%] leading-relaxed
                ${msg.role === 'customer'
                  ? 'bg-accent/30 text-text-primary border border-accent/20 rounded-br-sm'
                  : 'bg-white/5 text-text-primary border border-white/[0.08] rounded-bl-sm'
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {showTyping && (
          <div className="flex justify-start">
            <div className="px-3.5 py-2.5 rounded-2xl rounded-bl-sm bg-white/5 border border-white/[0.08] flex items-center gap-1">
              {[0, 0.2, 0.4].map((delay, i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-accent-light inline-block"
                  style={{ animation: `typing_dot 1.4s ease-in-out ${delay}s infinite` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
        <div className="flex-1 h-8 rounded-full bg-white/5 border border-white/[0.08] px-3 flex items-center">
          <span className="text-xs text-white/20">Message...</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-accent/30 flex items-center justify-center border border-accent/30">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-accent-light" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </div>
      </div>
    </div>
  )
}
