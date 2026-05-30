'use client'

import { useWhatsAppStatus } from '@/hooks/useWhatsAppStatus'
import { MessageSquare, Zap, Shield, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function WhatsAppConnect() {
  const { status, qr, phone, connect, disconnect } = useWhatsAppStatus()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#050507] text-[#EFEFEF] flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        {/* IDLE */}
        {status === 'idle' && (
          <div className="flex flex-col space-y-10 animate-[fadeIn_0.3s_cubic-bezier(0.23,1,0.32,1)]">
            <div>
              <h1 className="font-playfair font-black text-[42px] leading-tight mb-3">
                Connect Your WhatsApp
              </h1>
              <p className="text-[rgba(239,239,239,0.50)] text-lg">
                Scan once. Your AI answers every customer from now on.
              </p>
            </div>

            <div className="space-y-5">
              {[
                { icon: MessageSquare, label: 'Works with your existing WhatsApp number' },
                { icon: Zap, label: 'AI replies in under 3 seconds' },
                { icon: Shield, label: 'Session stays on your device' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-4 text-[rgba(239,239,239,0.75)]">
                  <Icon className="w-6 h-6 text-[#D4A853] shrink-0" />
                  <span className="font-medium text-[17px]">{label}</span>
                </div>
              ))}
            </div>

            <button
              onClick={connect}
              className="w-full bg-[#D4A853] hover:bg-[#E0B968] text-[#050507] font-bold py-4 rounded-xl transition-[background,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
            >
              Connect WhatsApp →
            </button>
          </div>
        )}

        {/* LOADING */}
        {status === 'loading' && (
          <div className="flex flex-col space-y-10 animate-[fadeIn_0.3s_cubic-bezier(0.23,1,0.32,1)]">
            <div>
              <h1 className="font-playfair font-black text-[42px] leading-tight mb-3">
                Connect Your WhatsApp
              </h1>
              <p className="text-[rgba(239,239,239,0.50)] text-lg">Initializing local session…</p>
            </div>
            <button
              disabled
              className="w-full bg-[rgba(212,168,83,0.5)] text-[#050507] font-bold py-4 rounded-xl flex items-center justify-center gap-2"
            >
              <Loader2 className="w-5 h-5 animate-spin-slow" />
              Preparing connection...
            </button>
            <p className="text-[rgba(239,239,239,0.28)] text-center text-sm">Takes about 10 seconds…</p>
          </div>
        )}

        {/* QR */}
        {status === 'qr_ready' && qr && (
          <div className="flex flex-col items-center space-y-8 bg-[rgba(255,255,255,0.02)] p-8 rounded-3xl border border-[rgba(255,255,255,0.06)] animate-[fadeIn_0.3s_cubic-bezier(0.23,1,0.32,1)]">
            <span className="text-[11px] font-bold tracking-widest text-[#D4A853] uppercase">
              Scan with your phone
            </span>

            <div className="bg-white p-4 rounded-[20px] shadow-2xl">
              <Image
                src={qr}
                alt="WhatsApp QR Code"
                width={248}
                height={248}
                className="rounded-lg"
                unoptimized
              />
            </div>

            <div className="w-full space-y-3">
              {[
                'Open WhatsApp on your phone',
                'Tap Menu (⋮) → Linked Devices → Link a Device',
                'Point your camera at this code',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[rgba(212,168,83,0.10)] text-[#D4A853] flex items-center justify-center text-sm font-bold shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-[rgba(239,239,239,0.60)] text-sm pt-0.5">{step}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-[rgba(239,239,239,0.40)] text-sm">
              <div className="w-2 h-2 bg-[#D4A853] rounded-full animate-pulse" />
              Waiting for scan…
            </div>
          </div>
        )}

        {/* CONNECTED */}
        {status === 'connected' && (
          <div className="flex flex-col items-center space-y-8 text-center animate-[fadeIn_0.3s_cubic-bezier(0.23,1,0.32,1)]">
            <div className="w-24 h-24 rounded-full bg-[rgba(37,211,102,0.10)] flex items-center justify-center">
              <svg className="w-12 h-12 text-[#25D366]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline
                  points="20 6 9 17 4 12"
                  strokeDasharray="100"
                  style={{ animation: 'drawCheck 0.6s cubic-bezier(0.23,1,0.32,1) forwards' }}
                />
              </svg>
            </div>

            <div>
              <h1 className="font-playfair font-black text-[52px] leading-none mb-2">
                Your AI is live.
              </h1>
              <p className="text-[rgba(239,239,239,0.50)] text-lg">
                Orda is now answering every customer.
              </p>
            </div>

            <div className="w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] p-6 rounded-2xl text-left space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[rgba(239,239,239,0.50)]">WhatsApp:</span>
                <span className="font-medium">+{phone || 'Connected'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[rgba(239,239,239,0.50)]">AI Engine:</span>
                <span className="font-medium text-[#D4A853]">Gemini 2.0 Flash — Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[rgba(239,239,239,0.50)]">Auto-reply:</span>
                <span className="font-medium text-[#25D366]">On</span>
              </div>
            </div>

            <div className="w-full space-y-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-[#D4A853] hover:bg-[#E0B968] text-[#050507] font-bold py-4 rounded-xl transition-[background,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
              >
                Go to Dashboard →
              </button>
              <button
                onClick={() => {
                  if (confirm('Disconnect WhatsApp AI?')) disconnect()
                }}
                className="text-sm font-medium text-[rgba(239,239,239,0.35)] hover:text-red-400 transition-colors duration-150 active:scale-[0.97]"
              >
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
