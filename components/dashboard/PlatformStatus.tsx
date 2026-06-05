'use client'

import type { Business } from '@/types/database'

const PLATFORMS = [
  {
    key: 'whatsapp_connected' as keyof Business,
    label: 'WhatsApp',
    color: '#25D366',
    icon: (
      <svg width="22" height="22" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="22" fill="#25D366" />
        <path d="M31.3 12.7A13.1 13.1 0 0022 9C15 9 9.3 14.7 9.3 21.7a12.6 12.6 0 001.8 6.5L9 35l7-1.8a13 13 0 006 1.5c7 0 12.7-5.7 12.7-12.7 0-3.4-1.3-6.6-3.4-8.8z" fill="white" />
      </svg>
    ),
  },
  {
    key: 'instagram_connected' as keyof Business,
    label: 'Instagram',
    color: '#C13584',
    icon: (
      <svg width="22" height="22" viewBox="0 0 44 44" fill="none">
        <defs>
          <radialGradient id="ps-ig" cx="26%" cy="110%" r="130%">
            <stop offset="0%" stopColor="#FDF497" />
            <stop offset="44%" stopColor="#FD5949" />
            <stop offset="68%" stopColor="#D6249F" />
            <stop offset="100%" stopColor="#285AEB" />
          </radialGradient>
        </defs>
        <rect width="44" height="44" rx="12" fill="url(#ps-ig)" />
        <rect x="10" y="10" width="24" height="24" rx="7" stroke="white" strokeWidth="2.5" />
        <circle cx="22" cy="22" r="6" stroke="white" strokeWidth="2.5" />
        <circle cx="30.5" cy="13.5" r="2" fill="white" />
      </svg>
    ),
  },
  {
    key: 'tiktok_connected' as keyof Business,
    label: 'TikTok',
    color: '#FE2C55',
    icon: (
      <svg width="22" height="22" viewBox="0 0 44 44" fill="none">
        <rect width="44" height="44" rx="12" fill="#010101" />
        <path d="M28 10a6 6 0 004 3.5v4a10 10 0 01-6-2v9a7 7 0 11-7-7h1v4a3 3 0 103 3V10h5z" fill="white" />
      </svg>
    ),
  },
  {
    key: 'facebook_connected' as keyof Business,
    label: 'Facebook',
    color: '#1877F2',
    icon: (
      <svg width="22" height="22" viewBox="0 0 44 44" fill="none">
        <rect width="44" height="44" rx="12" fill="#1877F2" />
        <path d="M28 8h-4a6 6 0 00-6 6v3h-3v5h3v12h5V22h4l1-5h-5v-3a1 1 0 011-1h4V8z" fill="white" />
      </svg>
    ),
  },
]

interface Props {
  business: Business
}

export default function PlatformStatus({ business }: Props) {
  return (
    <div className="bg-orda-surface border border-orda-border rounded-[14px] p-6 h-full">
      <h2 className="text-orda-light font-bold font-space-grotesk text-base mb-5">
        Connected Platforms
      </h2>
      <div className="space-y-3">
        {PLATFORMS.map((p) => {
          const connected = !!business[p.key]
          return (
            <div
              key={p.key}
              className="flex items-center justify-between gap-3 p-3 rounded-lg border border-orda-border"
              style={{ background: connected ? `${p.color}08` : undefined }}
            >
              <div className="flex items-center gap-3">
                {p.icon}
                <span className="text-orda-light text-[13px] font-medium">{p.label}</span>
              </div>
              {connected ? (
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-orda-success" />
                  <span className="text-orda-success text-[12px] font-medium">Connected</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orda-grey/40" />
                  <span className="text-orda-grey text-[12px]">Not connected</span>
                  <button className="text-orda-accent text-[11px] font-semibold hover:underline ml-1">
                    Connect
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
