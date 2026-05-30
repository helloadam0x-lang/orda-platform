import { useState, useEffect, useRef, useCallback } from 'react'

export type WAStatus = 'idle' | 'loading' | 'qr_ready' | 'connected' | 'reconnecting'

export function useWhatsAppStatus() {
  const [status, setStatus] = useState<WAStatus>('idle')
  const [qr, setQr] = useState<string | null>(null)
  const [phone, setPhone] = useState<string | null>(null)
  const poll = useRef<NodeJS.Timeout | null>(null)

  const stopPoll = () => { if (poll.current) clearInterval(poll.current) }

  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/whatsapp/status')
      const data = await res.json()
      setStatus(data.status as WAStatus)
      if (data.qr) setQr(data.qr)
      if (data.phone) setPhone(data.phone)
      if (data.status === 'connected') stopPoll()
    } catch {}
  }, [])

  const connect = async () => {
    setStatus('loading')
    setQr(null)
    try {
      const res = await fetch('/api/whatsapp/qr')
      const data = await res.json()
      if (data.status === 'connected') {
        setStatus('connected')
        if (data.phone) setPhone(data.phone)
      } else if (data.qr) {
        setQr(data.qr)
        setStatus('qr_ready')
        poll.current = setInterval(checkStatus, 3000)
      } else {
        setStatus('idle')
      }
    } catch {
      setStatus('idle')
    }
  }

  const disconnect = async () => {
    stopPoll()
    await fetch('/api/whatsapp/disconnect', { method: 'POST' })
    setStatus('idle')
    setQr(null)
    setPhone(null)
  }

  useEffect(() => {
    checkStatus()
    return stopPoll
  }, [checkStatus])

  return { status, qr, phone, connect, disconnect }
}
