'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'

// ── Platform Blueprints ──────────────────────────────────────────────────────
interface PlatformConfig {
  name: string
  dot: string
  screen: string
  header: string
  received: string
  sent: string
  glow: string
  inputBg: string
  handle: string
  sub: string
  avatarBg: string
  logo: () => JSX.Element
}

interface PhoneChassisProps {
  id: string
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
    logo: () => (
      <svg width="18" height="18" viewBox="0 0 44 44" fill="none">
        <defs>
          <radialGradient id="ig-glow" cx="26%" cy="110%" r="130%">
            <stop offset="0%" stopColor="#FDF497"/><stop offset="15%" stopColor="#FDF497"/>
            <stop offset="44%" stopColor="#FD5949"/><stop offset="68%" stopColor="#D6249F"/>
            <stop offset="100%" stopColor="#285AEB"/>
          </radialGradient>
        </defs>
        <rect width="44" height="44" rx="12" fill="url(#ig-glow)"/>
        <rect x="10" y="10" width="24" height="24" rx="7" stroke="white" strokeWidth="2.5"/>
        <circle cx="22" cy="22" r="6" stroke="white" strokeWidth="2.5"/>
        <circle cx="30.5" cy="13.5" r="2" fill="white"/>
      </svg>
    ),
  },
  whatsapp: {
    name: 'WhatsApp',
    dot: '#25D366',
    screen: 'bg-[#0B141A]',
    header: 'bg-[#1F2C33]/95 backdrop-blur-2xl border-b border-white/[0.04]',
    received: 'bg-[#1F2C33] text-white/95',
    sent: 'bg-[#005C4B] text-white',
    glow: 'rgba(37,211,102,0.3)',
    inputBg: 'bg-[#2A3942]',
    handle: 'Orda Business',
    sub: 'online',
    avatarBg: 'bg-gradient-to-tr from-[#25D366] to-[#128C7E]',
    logo: () => (
      <svg width="18" height="18" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="22" fill="#25D366"/>
        <path d="M31.3 12.7A13.1 13.1 0 0022 9C15 9 9.3 14.7 9.3 21.7a12.6 12.6 0 001.8 6.5L9 35l7-1.8a13 13 0 006 1.5c7 0 12.7-5.7 12.7-12.7 0-3.4-1.3-6.6-3.4-8.8zM22 32.7a10.8 10.8 0 01-5.5-1.5l-.4-.2-4 1 1-3.9-.3-.4a10.7 10.7 0 1110.2 5zm5.9-8c-.3-.2-2-.9-2.3-1.1-.3-.1-.5-.2-.8.2s-.9 1.1-1.1 1.3c-.2.2-.4.3-.7.1a9 9 0 01-2.6-1.6 9.9 9.9 0 01-1.8-2.2c-.2-.4 0-.6.2-.8l.5-.6c.1-.2.2-.4.4-.6.1-.2.1-.4-.1-.6-.2-.2-.8-2-1.1-2.7-.3-.7-.6-.6-.8-.6h-.6a1.2 1.2 0 00-.9.4c-.3.4-1.2 1.2-1.2 2.9s1.3 3.3 1.4 3.5 2.4 3.8 5.9 5.2c.8.4 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 2-.8 2.3-1.6.3-.8.3-1.5.2-1.6-.2-.2-.4-.3-.7-.4z" fill="white"/>
      </svg>
    ),
  },
  tiktok: {
    name: 'TikTok',
    dot: '#FE2C55',
    screen: 'bg-[#121212]',
    header: 'bg-[#161618]/95 backdrop-blur-2xl border-b border-white/[0.06]',
    received: 'bg-[#2F2F2F] text-white/90',
    sent: 'bg-gradient-to-r from-[#FE2C55] to-[#ff4162] text-white',
    glow: 'rgba(254,44,85,0.3)',
    inputBg: 'bg-[#252525]',
    handle: '@orda.business',
    sub: 'Active 2m ago',
    avatarBg: 'bg-gradient-to-tr from-[#FE2C55] to-[#69C9D0]',
    logo: () => (
      <svg width="18" height="18" viewBox="0 0 44 44" fill="none">
        <rect width="44" height="44" rx="12" fill="#010101"/>
        <g>
          <path d="M30 12a7 7 0 01-5-4.5H20v18a3.4 3.4 0 01-3.4 3 3.4 3.4 0 01-3.4-3.4 3.4 3.4 0 013.4-3.4c.3 0 .6 0 1 .1V16.9l-1-.05a7.4 7.4 0 00-7.4 7.4 7.4 7.4 0 007.4 7.4 7.4 7.4 0 007.4-7.4V16.6a11.9 11.9 0 007 2.3v-4a7.1 7.1 0 01-1.4-.9z" fill="#69C9D0" transform="translate(-1.5,-1.5)"/>
          <path d="M30 12a7 7 0 01-5-4.5H20v18a3.4 3.4 0 01-3.4 3 3.4 3.4 0 01-3.4-3.4 3.4 3.4 0 013.4-3.4c.3 0 .6 0 1 .1V16.9l-1-.05a7.4 7.4 0 00-7.4 7.4 7.4 7.4 0 007.4 7.4 7.4 7.4 0 007.4-7.4V16.6a11.9 11.9 0 007 2.3v-4a7.1 7.1 0 01-1.4-.9z" fill="#FE2C55" transform="translate(1.5,1.5)"/>
          <path d="M30 12a7 7 0 01-5-4.5H20v18a3.4 3.4 0 01-3.4 3 3.4 3.4 0 01-3.4-3.4 3.4 3.4 0 013.4-3.4c.3 0 .6 0 1 .1V16.9l-1-.05a7.4 7.4 0 00-7.4 7.4 7.4 7.4 0 007.4 7.4 7.4 7.4 0 007.4-7.4V16.6a11.9 11.9 0 007 2.3v-4a7.1 7.1 0 01-1.4-.9z" fill="white"/>
        </g>
      </svg>
    ),
  },
}

type Key = keyof typeof PLATFORMS

const CHAT_SEQUENCE = [
  { from: 'customer', text: 'Hey! Is the new collection live yet?',                          t: '1:12 PM' },
  { from: 'orda',     text: 'Just dropped today! What kind of gear are you looking for?',    t: '1:12 PM' },
  { from: 'customer', text: 'Jackets, size L please 🔥',                                     t: '1:13 PM' },
  { from: 'orda',     text: 'I have 3 styles reserved in Size L. Sending the lookbook now.', t: '1:13 PM' },
]

// ── Inlined Utility CSS for Pure Copy-Paste ──────────────────────────────────
const hideScrollbarStyle = {
  msOverflowStyle: 'none' as const,
  scrollbarWidth: 'none' as const,
}

// ── Interactive Lookbook Component ───────────────────────────────────────────
function ProductCarousel() {
  const products = [
    { name: 'Onyx Techwear Shell',    price: '$189', tag: 'Size L', gradient: 'from-zinc-800 to-zinc-950'   },
    { name: 'Cyber Neon Windbreaker', price: '$210', tag: '3 Left', gradient: 'from-purple-900/40 to-black' },
    { name: 'Minimalist Slate Parka', price: '$175', tag: 'New',    gradient: 'from-blue-950 to-black'      },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full flex gap-3 overflow-x-auto pb-2 pt-1 snap-x snap-mandatory"
      style={hideScrollbarStyle}
    >
      {products.map((p, i) => (
        <div
          key={i}
          className="w-[150px] shrink-0 bg-[#16161A]/90 border border-white/[0.08] rounded-2xl overflow-hidden snap-center shadow-xl flex flex-col justify-between"
        >
          <div className={`h-[100px] bg-gradient-to-br ${p.gradient} relative flex items-center justify-center`}>
            <span className="text-[9px] font-black tracking-widest text-white/20 uppercase">Item {i + 1}</span>
            <span className="absolute top-2 left-2 text-[8px] bg-white/10 backdrop-blur-md px-1.5 py-0.5 rounded-full text-white/90 font-medium border border-white/5">
              {p.tag}
            </span>
          </div>
          <div className="p-2 bg-black/40 backdrop-blur-sm flex flex-col gap-1">
            <div className="text-[10px] font-bold text-white/90 truncate tracking-tight">{p.name}</div>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-[11px] font-extrabold text-purple-400">{p.price}</span>
              <button className="text-[8px] bg-white text-black font-black px-2 py-1 rounded-lg hover:bg-purple-500 hover:text-white transition-all">
                Buy
              </button>
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  )
}

// ── Smartphone UI Blueprint ──────────────────────────────────────────────────
function PhoneChassis({ id, rotate = 0, scale = 1, zIndex = 1, tx = 0, ty = 0 }: PhoneChassisProps) {
  const p = PLATFORMS[id as Key]
  const [shown, setShown] = useState<number[]>([])
  const [typing, setTyping] = useState(false)
  const [showCarousel, setShowCarousel] = useState(false)
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    const timeline: ReturnType<typeof setTimeout>[] = []
    setShown([])
    setTyping(false)
    setShowCarousel(false)

    let currentDelay = 600

    CHAT_SEQUENCE.forEach((msg, idx) => {
      if (msg.from === 'orda') {
        timeline.push(setTimeout(() => setTyping(true), currentDelay))
        currentDelay += 1300
        timeline.push(setTimeout(() => {
          setTyping(false)
          setShown(s => [...s, idx])
          if (idx === CHAT_SEQUENCE.length - 1) setShowCarousel(true)
        }, currentDelay))
      } else {
        timeline.push(setTimeout(() => setShown(s => [...s, idx]), currentDelay))
      }
      currentDelay += 700
    })

    timeline.push(setTimeout(() => setCycle(c => c + 1), currentDelay + 5000))

    return () => timeline.forEach(clearTimeout)
  }, [cycle, id])

  return (
    <div
      className="relative shrink-0 w-[245px] rounded-[48px] bg-gradient-to-b from-[#313135] via-[#161618] to-[#0A0A0C] p-[1px] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)]"
      style={{
        zIndex,
        transform: `translate3d(${tx}px, ${ty}px, 0) scale(${scale}) rotateY(${rotate}deg)`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Internal Core Display */}
      <div className={`m-[7px] ${p.screen} rounded-[40px] overflow-hidden h-[510px] flex flex-col relative`}>

        {/* Cinematic Backdrop Radial Ambient */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen z-10"
          style={{ background: `radial-gradient(circle at 80% 10%, ${p.glow} 0%, transparent 65%)` }}
        />

        {/* Dynamic Island */}
        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-[105px] h-[28px] bg-black rounded-full z-50 flex items-center justify-between px-3.5 shadow-inner border border-white/5">
          <div className="w-2 h-2 rounded-full bg-[#0D0D11] border border-white/5 flex items-center justify-center">
            <div className="w-0.5 h-0.5 rounded-full bg-indigo-900/40" />
          </div>
          <div className="w-1 h-1 rounded-full bg-green-500/70 shadow-[0_0_4px_rgba(34,197,94,0.6)]" />
        </div>

        {/* Status Bar */}
        <div className="absolute top-0 inset-x-0 h-12 z-40 flex items-end justify-between px-6 pb-1 text-white text-[12px] font-bold tracking-tight">
          <span>1:12</span>
          <div className="flex items-center gap-1 opacity-80 scale-90">
            <svg width="15" height="10" viewBox="0 0 17 11" fill="none"><rect x="0" y="8" width="3" height="3" rx="1" fill="white"/><rect x="4.5" y="5.5" width="3" height="5.5" rx="1" fill="white"/><rect x="9" y="3" width="3" height="8" rx="1" fill="white"/><rect x="13.5" y="0" width="3" height="11" rx="1" fill="white" opacity="0.3"/></svg>
            <svg width="20" height="10" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="white" strokeOpacity="0.4"/><rect x="2.5" y="2.5" width="14" height="7" rx="1.5" fill="white"/></svg>
          </div>
        </div>

        {/* App Frame Header Bar */}
        <div className={`mt-[46px] ${p.header} px-3.5 py-2.5 flex items-center gap-2.5 z-30 shrink-0`}>
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none" className="opacity-40"><path d="M7 1L1 7l6 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <div className={`w-7 h-7 rounded-full ${p.avatarBg} flex items-center justify-center font-black text-white text-[12px] shadow-md`}>O</div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-[12px] font-bold truncate tracking-tight">{p.handle}</div>
            <div className="flex items-center gap-1 mt-0.5">
              <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-1 h-1 rounded-full" style={{ backgroundColor: p.dot }} />
              <span className="text-white/40 text-[8.5px] font-bold uppercase tracking-wider">{p.sub}</span>
            </div>
          </div>
          <div className="shrink-0 opacity-80">{p.logo()}</div>
        </div>

        {/* Core Live Chat Thread */}
        <div
          className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-3 z-20"
          style={hideScrollbarStyle}
        >
          <AnimatePresence mode="popLayout">
            {CHAT_SEQUENCE.map((m, i) => {
              if (!shown.includes(i)) return null
              const isOrda = m.from === 'orda'
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 26 }}
                  className={`max-w-[85%] flex flex-col ${isOrda ? 'self-end items-end' : 'self-start items-start'}`}
                >
                  <div
                    className={`px-3 py-2 text-[12px] leading-snug border ${
                      isOrda
                        ? `${p.sent} rounded-[18px_18px_4px_18px] border-white/10 shadow-lg`
                        : `${p.received} rounded-[18px_18px_18px_4px] border-white/5`
                    }`}
                    style={{ filter: isOrda ? `drop-shadow(0 4px 10px ${p.glow})` : 'none' }}
                  >
                    <p className="m-0 tracking-tight font-medium">{m.text}</p>
                  </div>
                  <div className="flex items-center gap-0.5 mt-1 px-1 opacity-30 text-[8px] font-bold">
                    <span>{m.t}</span>
                    {isOrda && <span className={id === 'whatsapp' ? 'text-cyan-400' : 'text-white'}>✓✓</span>}
                  </div>
                </motion.div>
              )
            })}

            {typing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className={`${p.received} border border-white/5 rounded-[18px_18px_18px_4px] px-3.5 py-3 flex gap-1 items-center self-start shadow-sm`}
              >
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }}
                    className="w-1 h-1 rounded-full"
                    style={{ backgroundColor: p.dot }}
                  />
                ))}
              </motion.div>
            )}

            {showCarousel && <ProductCarousel />}
          </AnimatePresence>
        </div>

        {/* Message Input Bottom Sheet */}
        <div className="bg-black/40 backdrop-blur-xl border-t border-white/[0.05] px-3.5 pt-2 pb-5 flex items-center gap-2.5 shrink-0 z-30">
          <div className={`${p.inputBg} flex-1 border border-white/5 rounded-full px-3.5 py-1.5 text-white/30 text-[11px] font-medium flex items-center gap-1.5`}>
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
            Message…
          </div>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            style={{ background: p.sent.includes('gradient') ? 'linear-gradient(135deg, #FE2C55, #ff6b81)' : '#005C4B' }}
          >
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M1.5 6h9M7.5 2.5l3.5 3.5-3.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>

      </div>
    </div>
  )
}

// ── Master Display Stage ─────────────────────────────────────────────────────
export default function ShowcasePortfolio() {
  const containerRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const cx = (e.clientX - rect.left) / rect.width - 0.5
    const cy = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(cx)
    mouseY.set(cy)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const springX = useSpring(mouseX, { stiffness: 90, damping: 22 })
  const springY = useSpring(mouseY, { stiffness: 90, damping: 22 })
  const rotateX = useTransform(springY, [-0.5, 0.5], [18, -18])
  const rotateY = useTransform(springX, [-0.5, 0.5], [-22, 22])

  return (
    <div
      className="relative w-full min-h-[750px] bg-[#050507] overflow-hidden flex flex-col items-center justify-center py-12 px-4 select-none antialiased font-sans"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={containerRef}
    >
      {/* Clean Tech Vector Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* Atmospheric Space Aura Projections */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-950/20 rounded-full filter blur-[130px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-950/15 rounded-full filter blur-[130px] pointer-events-none mix-blend-screen" />

      {/* Section Typography Branding Header */}
      <div className="absolute top-10 flex flex-col items-center gap-1.5 text-center z-40">
        <span className="px-3 py-1 bg-white/[0.04] border border-white/10 rounded-full text-white/50 text-[9px] font-extrabold tracking-[0.25em] uppercase backdrop-blur-md">
          Automated Conversational Flow
        </span>
        <h2 className="text-white/95 text-xl md:text-2xl font-black tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
          Omnichannel Client Experience
        </h2>
      </div>

      {/* 3D Viewport Presentation Wrapper */}
      <motion.div
        className="w-full max-w-5xl flex items-center justify-center mt-12 z-20"
        style={{
          perspective: 1500,
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-3 relative pt-8">
          <PhoneChassis id="instagram" rotate={-8}  scale={0.88} zIndex={10} tx={35}  ty={30} />
          <PhoneChassis id="whatsapp"  rotate={0}   scale={1.02} zIndex={30} tx={0}   ty={0}  />
          <PhoneChassis id="tiktok"    rotate={8}   scale={0.88} zIndex={10} tx={-35} ty={30} />
        </div>
      </motion.div>

      {/* Bottom Architectural Navigation Chips */}
      <div className="mt-14 flex flex-wrap gap-2.5 items-center justify-center z-40 max-w-sm">
        {(['instagram', 'whatsapp', 'tiktok'] as Key[]).map(k => (
          <div
            key={k}
            className="flex items-center gap-2 bg-[#0F0F12]/80 border border-white/[0.06] backdrop-blur-md rounded-full py-2 pl-3 pr-4 shadow-xl transition-all hover:border-white/20"
          >
            {PLATFORMS[k].logo()}
            <span className="text-white/40 text-[10px] font-black tracking-wider uppercase">
              {PLATFORMS[k].name} Live
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
