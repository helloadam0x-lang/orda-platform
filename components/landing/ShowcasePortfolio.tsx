'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Animation Config ──────────────────────────────────────────────────────────
const spring = { type: 'spring' as const, stiffness: 300, damping: 24, mass: 0.8 }

// ── Types ─────────────────────────────────────────────────────────────────────
interface PlatformConfig {
  name: string
  dot: string
  screen: string
  header: string
  received: string
  sent: string
  sentSolid?: string
  glow: string
  inputBg: string
  handle: string
  sub: string
  avatarBg: string
  logo: (size?: number) => JSX.Element
}

interface PhoneProps {
  id: string
  delay?: number
  rotate?: number
  scale?: number
  zIndex?: number
  tx?: number
  ty?: number
}

// ── Platform Data ──────────────────────────────────────────────────────────────
const PLATFORMS: Record<string, PlatformConfig> = {
  instagram: {
    name: 'Instagram',
    dot: '#E1306C',
    screen: 'bg-[#000000]',
    header: 'bg-black/80 backdrop-blur-3xl border-b border-white/[0.08]',
    received: 'bg-[#1C1C1E] text-white/95',
    sent: 'bg-gradient-to-r from-[#833AB4] via-[#C13584] to-[#F77737] text-white',
    glow: 'rgba(193,53,132,0.3)',
    inputBg: 'bg-[#121212]',
    handle: 'orda.business',
    sub: 'Active now',
    avatarBg: 'bg-gradient-to-tr from-[#833AB4] via-[#C13584] to-[#F77737]',
    logo: (size = 18) => (
      <svg key="ig" width={size} height={size} viewBox="0 0 44 44" fill="none">
        <defs>
          <radialGradient id="ig-grad" cx="26%" cy="110%" r="130%">
            <stop offset="0%"   stopColor="#FDF497" />
            <stop offset="15%"  stopColor="#FDF497" />
            <stop offset="44%"  stopColor="#FD5949" />
            <stop offset="68%"  stopColor="#D6249F" />
            <stop offset="100%" stopColor="#285AEB" />
          </radialGradient>
        </defs>
        <rect width="44" height="44" rx="12" fill="url(#ig-grad)" />
        <rect x="10" y="10" width="24" height="24" rx="7" stroke="white" strokeWidth="2.5" />
        <circle cx="22" cy="22" r="6" stroke="white" strokeWidth="2.5" />
        <circle cx="30.5" cy="13.5" r="2" fill="white" />
      </svg>
    ),
  },
  whatsapp: {
    name: 'WhatsApp',
    dot: '#25D366',
    sentSolid: '#005C4B',
    screen: 'bg-[#0B141A]',
    header: 'bg-[#1F2C33]/90 backdrop-blur-3xl border-b border-white/[0.05]',
    received: 'bg-[#1F2C33] text-white/95',
    sent: 'bg-[#005C4B] text-white',
    glow: 'rgba(37,211,102,0.3)',
    inputBg: 'bg-[#2A3942]',
    handle: 'Orda Business',
    sub: 'online',
    avatarBg: 'bg-gradient-to-tr from-[#25D366] to-[#128C7E]',
    logo: (size = 18) => (
      <svg key="wa" width={size} height={size} viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="22" fill="#25D366" />
        <path d="M31.3 12.7A13.1 13.1 0 0022 9C15 9 9.3 14.7 9.3 21.7a12.6 12.6 0 001.8 6.5L9 35l7-1.8a13 13 0 006 1.5c7 0 12.7-5.7 12.7-12.7 0-3.4-1.3-6.6-3.4-8.8zM22 32.7a10.8 10.8 0 01-5.5-1.5l-.4-.2-4 1 1-3.9-.3-.4a10.7 10.7 0 1110.2 5zm5.9-8c-.3-.2-2-.9-2.3-1.1-.3-.1-.5-.2-.8.2s-.9 1.1-1.1 1.3c-.2.2-.4.3-.7.1a9 9 0 01-2.6-1.6 9.9 9.9 0 01-1.8-2.2c-.2-.4 0-.6.2-.8l.5-.6c.1-.2.2-.4.4-.6.1-.2.1-.4-.1-.6-.2-.2-.8-2-1.1-2.7-.3-.7-.6-.6-.8-.6h-.6a1.2 1.2 0 00-.9.4c-.3.4-1.2 1.2-1.2 2.9s1.3 3.3 1.4 3.5 2.4 3.8 5.9 5.2c.8.4 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 2-.8 2.3-1.6.3-.8.3-1.5.2-1.6-.2-.2-.4-.3-.7-.4z" fill="white" />
      </svg>
    ),
  },
  tiktok: {
    name: 'TikTok',
    dot: '#FE2C55',
    screen: 'bg-[#121212]',
    header: 'bg-[#161618]/90 backdrop-blur-3xl border-b border-white/[0.08]',
    received: 'bg-[#2F2F2F] text-white/95',
    sent: 'bg-gradient-to-r from-[#FE2C55] to-[#ff4162] text-white',
    glow: 'rgba(254,44,85,0.3)',
    inputBg: 'bg-[#252525]',
    handle: '@orda.business',
    sub: 'Active 2m ago',
    avatarBg: 'bg-gradient-to-tr from-[#FE2C55] to-[#69C9D0]',
    logo: (size = 18) => (
      <svg key="tt" width={size} height={size} viewBox="0 0 44 44" fill="none">
        <rect width="44" height="44" rx="12" fill="#010101" />
        <path d="M30 12a7 7 0 01-5-4.5H20v18a3.4 3.4 0 01-3.4 3 3.4 3.4 0 01-3.4-3.4 3.4 3.4 0 013.4-3.4c.3 0 .6 0 1 .1V16.9l-1-.05a7.4 7.4 0 00-7.4 7.4 7.4 7.4 0 007.4 7.4 7.4 7.4 0 007.4-7.4V16.6a11.9 11.9 0 007 2.3v-4a7.1 7.1 0 01-1.4-.9z" fill="#69C9D0" transform="translate(-1.5,-1.5)" />
        <path d="M30 12a7 7 0 01-5-4.5H20v18a3.4 3.4 0 01-3.4 3 3.4 3.4 0 01-3.4-3.4 3.4 3.4 0 013.4-3.4c.3 0 .6 0 1 .1V16.9l-1-.05a7.4 7.4 0 00-7.4 7.4 7.4 7.4 0 007.4 7.4 7.4 7.4 0 007.4-7.4V16.6a11.9 11.9 0 007 2.3v-4a7.1 7.1 0 01-1.4-.9z" fill="#FE2C55" transform="translate(1.5,1.5)" />
        <path d="M30 12a7 7 0 01-5-4.5H20v18a3.4 3.4 0 01-3.4 3 3.4 3.4 0 01-3.4-3.4 3.4 3.4 0 013.4-3.4c.3 0 .6 0 1 .1V16.9l-1-.05a7.4 7.4 0 00-7.4 7.4 7.4 7.4 0 007.4 7.4 7.4 7.4 0 007.4-7.4V16.6a11.9 11.9 0 007 2.3v-4a7.1 7.1 0 01-1.4-.9z" fill="white" />
      </svg>
    ),
  },
}

type PlatformKey = keyof typeof PLATFORMS

const CONVERSATION = [
  { from: 'customer', text: 'Hey! Is the new collection live yet?',                         t: '1:12 PM' },
  { from: 'orda',     text: 'Just dropped today! What kind of gear are you looking for?',   t: '1:12 PM' },
  { from: 'customer', text: 'Jackets, size L please 🔥',                                    t: '1:13 PM' },
  { from: 'orda',     text: 'I have 3 styles reserved in Size L. Sending the lookbook now.', t: '1:13 PM' },
]

// ── Dynamic Island ─────────────────────────────────────────────────────────────
const DynamicIsland = () => (
  <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-[110px] h-[32px] bg-black rounded-full z-50 flex items-center justify-between px-3.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06),0_10px_20px_rgba(0,0,0,0.5)] overflow-hidden">
    <div className="w-2.5 h-2.5 rounded-full bg-[#08080A] border border-white/10 flex items-center justify-center shadow-inner">
      <div className="w-[3px] h-[3px] rounded-full bg-[#1c1c24]/50" />
    </div>
    <div className="flex gap-1.5 items-center">
      <div className="w-[3px] h-[3px] rounded-full bg-green-500/80 shadow-[0_0_4px_#22c55e]" />
      <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
    </div>
  </div>
)

// ── Product Carousel ────────────────────────────────────────────────────────────
function ProductCarousel() {
  const products = [
    { name: 'Onyx Techwear Shell',    price: '$189', tag: 'Size L', hue: 'from-zinc-700/40'   },
    { name: 'Cyber Neon Windbreaker', price: '$210', tag: '3 Left', hue: 'from-purple-600/30' },
    { name: 'Minimalist Slate Parka', price: '$175', tag: 'New',    hue: 'from-blue-600/30'   },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.2, ...spring }}
      className="w-full flex gap-3 overflow-x-auto pb-4 pt-2 scrollbar-none snap-x snap-mandatory px-1"
    >
      {products.map((prod, idx) => (
        <motion.div
          key={idx}
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="w-[155px] shrink-0 bg-[#16161A]/95 backdrop-blur-xl border border-white/10 rounded-[22px] overflow-hidden snap-center shadow-2xl cursor-pointer group relative"
        >
          <div className={`h-[110px] bg-gradient-to-br ${prod.hue} to-transparent relative flex items-center justify-center overflow-hidden`}>
            <span className="text-[10px] font-black text-white/30 tracking-widest uppercase z-10 group-hover:scale-110 transition-transform duration-500">
              Style {idx + 1}
            </span>
            <div className="absolute top-2.5 left-2.5 text-[9px] bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full text-white/90 font-semibold border border-white/10 shadow-sm">
              {prod.tag}
            </div>
          </div>
          <div className="p-3 flex flex-col gap-1.5 relative z-10 bg-gradient-to-b from-transparent to-black/60">
            <div className="text-[11px] font-bold text-white/95 truncate tracking-tight">{prod.name}</div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[12px] font-black text-white">{prod.price}</span>
              <button className="text-[9px] bg-white text-black font-bold px-3 py-1.5 rounded-xl hover:bg-zinc-200 transition-colors shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
                Reserve
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

// ── Phone Chassis ───────────────────────────────────────────────────────────────
function Phone({ id, delay = 0, rotate = 0, scale = 1, zIndex = 1, tx = 0, ty = 0 }: PhoneProps) {
  const p = PLATFORMS[id]
  const [shown, setShown] = useState<number[]>([])
  const [typing, setTyping] = useState(false)
  const [showCarousel, setShowCarousel] = useState(false)

  useEffect(() => {
    let cur = 800
    const timers: ReturnType<typeof setTimeout>[] = []
    setShown([])
    setTyping(false)
    setShowCarousel(false)

    CONVERSATION.forEach((m, i) => {
      if (m.from === 'orda') {
        timers.push(setTimeout(() => setTyping(true), cur))
        cur += 1200
        timers.push(setTimeout(() => {
          setTyping(false)
          setShown(s => [...s, i])
          if (i === CONVERSATION.length - 1) setShowCarousel(true)
        }, cur))
      } else {
        timers.push(setTimeout(() => setShown(s => [...s, i]), cur))
      }
      cur += 600
    })

    return () => timers.forEach(clearTimeout)
  }, [id])

  const sendBg = p.sent.includes('gradient')
    ? `linear-gradient(135deg, ${p.dot} 0%, ${p.dot}bb 100%)`
    : (p.sentSolid ?? p.dot)

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, rotateX: 20, rotateY: rotate - 10, scale: scale * 0.8 }}
      animate={{ opacity: 1, y: ty, x: tx, rotateX: 12, rotateY: rotate, scale }}
      transition={{ duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{
        scale: scale * 1.06,
        rotateX: 4,
        rotateY: rotate * 0.3,
        y: ty - 20,
        transition: { duration: 0.5, ease: 'easeOut' as const },
      }}
      className="relative shrink-0 w-[260px] rounded-[52px] bg-gradient-to-b from-[#3A3A40] via-[#1A1A1E] to-[#0D0D11] p-[1.5px] shadow-[0_35px_80px_rgba(0,0,0,0.95)] border border-white/10 select-none group"
      style={{ zIndex, transformStyle: 'preserve-3d' }}
    >
      {/* Hover glow halo */}
      <div
        className="absolute inset-0 rounded-[52px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ boxShadow: `0 0 80px ${p.glow}` }}
      />

      {/* Screen */}
      <div className={`m-[7px] ${p.screen} rounded-[42px] overflow-hidden h-[540px] flex flex-col relative border border-black/80 shadow-inner`}>

        {/* Ambient corner light */}
        <div
          className="absolute top-[-50px] right-[-50px] w-[180px] h-[180px] opacity-40 mix-blend-screen pointer-events-none z-10 blur-3xl"
          style={{ background: `radial-gradient(circle, ${p.glow} 0%, transparent 70%)` }}
        />

        <DynamicIsland />

        {/* Status bar */}
        <div className="absolute top-0 inset-x-0 h-14 z-40 flex items-end justify-between px-6 pb-2.5 text-white font-sans text-[12.5px] font-bold tracking-tight">
          <span>1:12</span>
          <div className="flex items-center gap-1.5 opacity-90">
            <svg width="15" height="10" viewBox="0 0 17 11" fill="none">
              <rect x="0"    y="8"   width="3" height="3"   rx="1" fill="white" />
              <rect x="4.5"  y="5.5" width="3" height="5.5" rx="1" fill="white" />
              <rect x="9"    y="3"   width="3" height="8"   rx="1" fill="white" />
              <rect x="13.5" y="0"   width="3" height="11"  rx="1" fill="white" opacity="0.3" />
            </svg>
            <svg width="14" height="10" viewBox="0 0 16 11" fill="none">
              <path d="M1.5 3A8.5 8.5 0 0114.5 3"  stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
              <path d="M4 5.5A5 5 0 0112 5.5"       stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              <circle cx="8" cy="9.5" r="1.5" fill="white" />
            </svg>
            <svg width="22" height="10" viewBox="0 0 25 12" fill="none">
              <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="white" strokeOpacity="0.4" />
              <rect x="2.5" y="2.5" width="15" height="7"  rx="1.5" fill="white" />
              <path d="M23 4v4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4" />
            </svg>
          </div>
        </div>

        {/* Chat header */}
        <div className={`mt-[52px] ${p.header} px-4 py-3.5 flex items-center gap-3 z-30 shrink-0 shadow-sm`}>
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none" className="opacity-50 shrink-0">
            <path d="M7 1L1 7l6 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className={`w-[34px] h-[34px] rounded-full ${p.avatarBg} flex items-center justify-center font-black text-white text-[14px] shadow-[0_2px_10px_rgba(0,0,0,0.5)]`}>
            O
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-[13.5px] font-bold truncate tracking-tight">{p.handle}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <motion.div
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: p.dot, boxShadow: `0 0 8px ${p.dot}` }}
              />
              <span className="text-[#8E8E93] text-[10px] font-semibold uppercase tracking-wider">{p.sub}</span>
            </div>
          </div>
          <div className="shrink-0">{p.logo(20)}</div>
        </div>

        {/* Messages stream */}
        <motion.div layout className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4 scrollbar-none z-20 relative">
          <AnimatePresence mode="popLayout">
            {CONVERSATION.map((m, i) => {
              if (!shown.includes(i)) return null
              const isOrda = m.from === 'orda'
              return (
                <motion.div
                  layout
                  key={i}
                  initial={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                  transition={spring}
                  className={`max-w-[85%] flex flex-col ${isOrda ? 'self-end items-end' : 'self-start items-start'}`}
                >
                  <div
                    className={`px-3.5 py-2.5 text-[12.5px] leading-[1.45] shadow-lg border relative ${
                      isOrda
                        ? `${p.sent} rounded-[20px_20px_4px_20px] border-white/10`
                        : `${p.received} rounded-[20px_20px_20px_4px] border-white/5`
                    }`}
                    style={{ filter: isOrda ? `drop-shadow(0 6px 16px ${p.glow})` : 'none' }}
                  >
                    <div
                      className="absolute inset-0 border border-white/10 mix-blend-overlay pointer-events-none"
                      style={{ borderRadius: 'inherit' }}
                    />
                    <p className="m-0 tracking-tight font-medium">{m.text}</p>
                  </div>
                  <div className="flex items-center gap-1 mt-1.5 px-1 opacity-50 text-[9px] font-bold tracking-wide">
                    <span>{m.t}</span>
                    {isOrda && (
                      <span className={id === 'whatsapp' ? 'text-[#4FC3F7]' : 'text-white'}>✓✓</span>
                    )}
                  </div>
                </motion.div>
              )
            })}

            {typing && (
              <motion.div
                layout
                key="typing"
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className={`${p.received} border border-white/5 rounded-[20px_20px_20px_4px] px-4 py-3.5 flex gap-1.5 items-center self-start shadow-md`}
              >
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                    className="w-[5px] h-[5px] rounded-full"
                    style={{ backgroundColor: p.dot }}
                  />
                ))}
              </motion.div>
            )}

            {showCarousel && (
              <motion.div layout key="carousel" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <ProductCarousel />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Input bar */}
        <div className="bg-black/60 backdrop-blur-2xl border-t border-white/[0.06] px-4 pt-3 pb-6 flex items-center gap-3 shrink-0 z-30">
          <div className={`${p.inputBg} flex-1 border border-white/10 rounded-full px-4 py-2.5 text-white/40 text-[12px] font-medium shadow-inner flex items-center gap-2 group-hover:border-white/20 transition-colors duration-300`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
            Message…
          </div>
          <motion.div
            whileTap={{ scale: 0.85 }}
            className="w-[34px] h-[34px] rounded-full flex items-center justify-center cursor-pointer shadow-lg shrink-0"
            style={{ background: sendBg }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1.5 6h9M7.5 2.5l3.5 3.5-3.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </div>

      </div>
    </motion.div>
  )
}

// ── Main Export ─────────────────────────────────────────────────────────────────
export default function ShowcasePortfolio() {
  return (
    <div className="relative w-full min-h-[850px] bg-[#050505] overflow-hidden flex flex-col items-center justify-center py-16 px-4 select-none antialiased font-sans">

      {/* Deep space gradients */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full filter blur-[140px] pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] bg-blue-600/10 rounded-full filter blur-[150px] pointer-events-none"
      />

      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute top-12 flex flex-col items-center gap-2 z-40"
      >
        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/60 text-[10px] font-bold tracking-[0.2em] uppercase backdrop-blur-md">
          Omnichannel Engagement
        </span>
        <h2 className="text-white/90 text-2xl font-bold tracking-tight">AI Conversational Commerce</h2>
      </motion.div>

      {/* 3D device array */}
      <div className="flex items-center justify-center w-full max-w-6xl mt-12 z-20" style={{ perspective: 1400 }}>
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-4 relative pt-10">
          <Phone id="instagram" delay={0.2} rotate={-12} scale={0.85} zIndex={10} tx={40}  ty={35} />
          <Phone id="whatsapp"  delay={0}   rotate={0}   scale={1.02} zIndex={30} tx={0}   ty={0}  />
          <Phone id="tiktok"    delay={0.4} rotate={12}  scale={0.85} zIndex={10} tx={-40} ty={35} />
        </div>
      </div>

      {/* Footer chips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="mt-16 flex flex-wrap gap-3 items-center justify-center z-40 max-w-md"
      >
        {(['instagram', 'whatsapp', 'tiktok'] as PlatformKey[]).map(k => (
          <div
            key={k}
            className="flex items-center gap-2 bg-[#121215]/60 border border-white/[0.08] backdrop-blur-xl rounded-full py-2 pl-3 pr-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer hover:bg-white/5 transition-colors duration-300"
          >
            {PLATFORMS[k].logo(16)}
            <span className="text-white/60 text-[11px] font-bold tracking-wide capitalize">
              {PLATFORMS[k].name} UI
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
