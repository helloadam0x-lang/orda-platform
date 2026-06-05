"use client";
import { motion, type Variants } from "framer-motion";

function SignalIcon() {
  return (
    <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
      <rect x="0"  y="8"  width="3" height="3"  rx="0.5" fill="white" />
      <rect x="4"  y="5"  width="3" height="6"  rx="0.5" fill="white" />
      <rect x="8"  y="3"  width="3" height="8"  rx="0.5" fill="white" />
      <rect x="12" y="0"  width="3" height="11" rx="0.5" fill="white" opacity="0.35" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
      <circle cx="7" cy="9.5" r="1.2" fill="white" />
      <path d="M3.5 7a5 5 0 0 1 7 0" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M1 4.5a9 9 0 0 1 12 0" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.45" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="20" height="11" viewBox="0 0 20 11" fill="none">
      <rect x="0.5" y="0.5" width="16" height="10" rx="2" stroke="white" strokeOpacity="0.55" />
      <rect x="2"   y="2"   width="10" height="7"  rx="1" fill="white" />
      <path d="M17.5 3.5v4a2 2 0 0 0 0-4z" fill="white" fillOpacity="0.5" />
    </svg>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.4 } },
};

const msgVariants: Variants = {
  hidden:   { opacity: 0, y: 16, filter: "blur(4px)" },
  visible:  { opacity: 1, y:  0, filter: "blur(0px)", transition: { duration: 0.6, ease: "easeOut" as const } },
};

const cBubble: React.CSSProperties = {
  background:    "rgba(255,255,255,0.07)",
  backdropFilter:"blur(12px)",
  border:        "0.5px solid rgba(255,255,255,0.1)",
  borderRadius:  "16px 16px 16px 3px",
  padding:       "9px 13px",
};

const oBubble: React.CSSProperties = {
  background: "linear-gradient(135deg, #6a1880 0%, #8729A0 50%, #a040c0 100%)",
  borderRadius: "16px 16px 3px 16px",
  padding: "9px 13px",
  boxShadow: "0 4px 24px rgba(135,41,160,0.5), 0 0 40px rgba(135,41,160,0.2), inset 0 1px 0 rgba(255,255,255,0.15)",
};

const mTxt: React.CSSProperties = { fontSize: 12, lineHeight: 1.5, fontFamily: "var(--font-inter)" };
const ts:   React.CSSProperties = { color: "rgba(255,255,255,0.3)", fontSize: 9, fontFamily: "var(--font-inter)", marginTop: 3 };

export default function PhoneMockup() {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>

      {/* ── Background orbs ── */}
      <div style={{ position:"absolute", width:500, height:500, top:-100, left:-150, background:"radial-gradient(circle, rgba(135,41,160,0.25) 0%, transparent 70%)", borderRadius:"50%", filter:"blur(80px)", pointerEvents:"none", zIndex:0 }} />
      <div style={{ position:"absolute", width:300, height:300, bottom:0, right:-100, background:"radial-gradient(circle, rgba(192,100,252,0.15) 0%, transparent 70%)", borderRadius:"50%", filter:"blur(60px)", pointerEvents:"none", zIndex:0 }} />
      <div style={{ position:"absolute", width:200, height:200, top:"40%", left:-80, background:"radial-gradient(circle, rgba(80,20,120,0.2) 0%, transparent 70%)", borderRadius:"50%", filter:"blur(50px)", pointerEvents:"none", zIndex:0 }} />

      {/* ── Phone frame ── */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, rotateY: -15, y: 40 }}
        animate={{ scale: 1,   opacity: 1, rotateY:  -8, y:  0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ rotateY: -4, scale: 1.02, transition: { duration: 0.5 } }}
        style={{
          position: "relative", zIndex: 1,
          width: 300,
          background: "linear-gradient(160deg, #2a2a2e 0%, #1a1a1e 30%, #0d0d10 100%)",
          borderRadius: 48,
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 50px 120px rgba(0,0,0,0.95), 0 0 200px rgba(135,41,160,0.15), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.8)",
          transformPerspective: 1200,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Left buttons */}
        <div style={{ position:"absolute", left:-2, top:100, display:"flex", flexDirection:"column" }}>
          <div style={{ width:3, height:18, background:"linear-gradient(#3a3a3e,#2a2a2e)", borderRadius:2, marginBottom:14 }} />
          <div style={{ width:3, height:28, background:"linear-gradient(#3a3a3e,#2a2a2e)", borderRadius:2, marginBottom:10 }} />
          <div style={{ width:3, height:28, background:"linear-gradient(#3a3a3e,#2a2a2e)", borderRadius:2 }} />
        </div>
        {/* Right power button */}
        <div style={{ position:"absolute", right:-2, top:160, width:3, height:40, background:"linear-gradient(#3a3a3e,#2a2a2e)", borderRadius:2 }} />

        {/* ── Inner screen ── */}
        <div style={{ margin:"10px 4px", background:"#0B0B0F", borderRadius:42, overflow:"hidden", height:580, position:"relative", display:"flex", flexDirection:"column" }}>

          {/* Screen mesh orbs */}
          <div style={{ position:"absolute", width:160, height:160, top:-20,   right:-20, background:"radial-gradient(circle, rgba(135,41,160,0.35) 0%, transparent 70%)", borderRadius:"50%", filter:"blur(40px)", pointerEvents:"none" }} />
          <div style={{ position:"absolute", width:120, height:120, bottom:60,  left:-30,  background:"radial-gradient(circle, rgba(100,20,140,0.25) 0%, transparent 70%)", borderRadius:"50%", filter:"blur(35px)", pointerEvents:"none" }} />
          <div style={{ position:"absolute", width:80,  height:80,  top:"45%", right:10,  background:"radial-gradient(circle, rgba(192,100,252,0.15) 0%, transparent 70%)", borderRadius:"50%", filter:"blur(30px)", pointerEvents:"none" }} />

          {/* Dynamic Island */}
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{ position:"absolute", top:10, left:"50%", transform:"translateX(-50%)", zIndex:20, width:115, height:30, background:"#000", borderRadius:20, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 10px" }}
          >
            <div style={{ width:8, height:8, background:"#1a1a1a", borderRadius:"50%" }} />
            <div style={{ display:"flex", gap:4 }}>
              <div style={{ width:5, height:5, background:"#1a1a1a", borderRadius:"50%" }} />
              <div style={{ width:5, height:5, background:"#1a1a1a", borderRadius:"50%" }} />
            </div>
          </motion.div>

          {/* Status bar */}
          <div style={{ position:"absolute", top:0, left:0, right:0, zIndex:10, display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 20px 0" }}>
            <span style={{ color:"white", fontSize:12, fontWeight:700, fontFamily:"var(--font-inter)" }}>9:41</span>
            <div style={{ display:"flex", gap:5, alignItems:"center" }}>
              <SignalIcon />
              <WifiIcon />
              <BatteryIcon />
            </div>
          </div>

          {/* Chat header */}
          <div style={{ marginTop:36, background:"rgba(18,18,23,0.95)", backdropFilter:"blur(20px)", borderBottom:"0.5px solid rgba(255,255,255,0.08)", padding:"10px 14px", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
            <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg, #8729A0, #5a1880)", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ color:"white", fontSize:14, fontWeight:800, fontFamily:"var(--font-space-grotesk)" }}>O</span>
            </div>
            <div style={{ flex:1 }}>
              <p style={{ color:"#FFFFFF", fontSize:13, fontWeight:600, fontFamily:"var(--font-inter)", margin:0 }}>Orda Business</p>
              <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:2 }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:"#00D97E", boxShadow:"0 0 8px #00D97E" }} />
                <span style={{ color:"#00D97E", fontSize:10, fontFamily:"var(--font-inter)" }}>Online</span>
              </div>
            </div>
            <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
              {[0,6,12].map(cx => <circle key={cx} cx={cx+2} cy="2" r="2" fill="rgba(255,255,255,0.3)" />)}
            </svg>
          </div>

          {/* Messages */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ flex:1, overflow:"hidden", padding:"12px 12px 4px", display:"flex", flexDirection:"column", gap:8, position:"relative", zIndex:1 }}
          >
            {/* 1 — customer */}
            <motion.div variants={msgVariants} style={{ alignSelf:"flex-start", maxWidth:"75%" }}>
              <div style={cBubble}><p style={{ ...mTxt, color:"rgba(255,255,255,0.88)" }}>Hi, is the new collection available?</p></div>
              <p style={ts}>9:41</p>
            </motion.div>

            {/* 2 — orda */}
            <motion.div variants={msgVariants} style={{ alignSelf:"flex-end", maxWidth:"78%" }}>
              <div style={oBubble}><p style={{ ...mTxt, color:"white" }}>Just arrived. Which category are you looking for?</p></div>
              <div style={{ display:"flex", gap:3, justifyContent:"flex-end", marginTop:3, alignItems:"center" }}>
                <span style={{ color:"rgba(255,255,255,0.6)", fontSize:9 }}>✓✓</span>
                <span style={{ ...ts, marginTop:0 }}>9:41</span>
              </div>
            </motion.div>

            {/* 3 — customer */}
            <motion.div variants={msgVariants} style={{ alignSelf:"flex-start", maxWidth:"75%" }}>
              <div style={cBubble}><p style={{ ...mTxt, color:"rgba(255,255,255,0.88)" }}>Something in a medium size please</p></div>
              <p style={ts}>9:42</p>
            </motion.div>

            {/* 4 — orda */}
            <motion.div variants={msgVariants} style={{ alignSelf:"flex-end", maxWidth:"78%" }}>
              <div style={oBubble}><p style={{ ...mTxt, color:"white" }}>We have exactly what you need. Let me show you.</p></div>
              <div style={{ display:"flex", gap:3, justifyContent:"flex-end", marginTop:3, alignItems:"center" }}>
                <span style={{ color:"rgba(255,255,255,0.6)", fontSize:9 }}>✓✓</span>
                <span style={{ ...ts, marginTop:0 }}>9:42</span>
              </div>
            </motion.div>

            {/* Typing indicator — fades out after 1.2s */}
            <motion.div
              style={{ alignSelf:"flex-start" }}
              initial={{ opacity:1 }}
              animate={{ opacity:[1,1,0] }}
              transition={{ duration:1.2, delay:1.6, times:[0,0.8,1] }}
            >
              <div style={{ ...cBubble, display:"flex", gap:5, alignItems:"center" }}>
                {[0, 0.15, 0.3].map((d, i) => (
                  <motion.div key={i} animate={{ y:[0,-6,0] }} transition={{ duration:0.8, repeat:Infinity, delay:d }}
                    style={{ width:6, height:6, borderRadius:"50%", background:"rgba(135,41,160,0.8)" }} />
                ))}
              </div>
            </motion.div>

            {/* 5 — orda delayed */}
            <motion.div
              initial={{ opacity:0, y:16, filter:"blur(4px)" }}
              animate={{ opacity:1, y:0,  filter:"blur(0px)" }}
              transition={{ duration:0.6, delay:2.8 }}
              style={{ alignSelf:"flex-end", maxWidth:"78%" }}
            >
              <div style={oBubble}><p style={{ ...mTxt, color:"white" }}>Here are the top options for you right now 👇</p></div>
            </motion.div>
          </motion.div>

          {/* AI Sphere visualizer */}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"4px 0", flexShrink:0 }}>
            <motion.svg
              width="56" height="56" viewBox="0 0 56 56" fill="none"
              animate={{ rotate:360 }}
              transition={{ duration:8, repeat:Infinity, ease:"linear" }}
            >
              <defs>
                <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%"   stopColor="#8729A0" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>
              <circle cx="28" cy="28" r="26" fill="rgba(135,41,160,0.06)" />
              <circle cx="28" cy="28" r="22" fill="none" stroke="url(#g1)" strokeWidth="1" />
              <ellipse cx="28" cy="28" rx="22" ry="7"  fill="none" stroke="rgba(135,41,160,0.5)"  strokeWidth="0.7" />
              <ellipse cx="28" cy="28" rx="7"  ry="22" fill="none" stroke="rgba(192,100,252,0.4)" strokeWidth="0.7" />
              <ellipse cx="28" cy="28" rx="22" ry="7"  fill="none" stroke="rgba(135,41,160,0.3)"  strokeWidth="0.7" transform="rotate(45 28 28)" />
              <ellipse cx="28" cy="28" rx="22" ry="7"  fill="none" stroke="rgba(135,41,160,0.3)"  strokeWidth="0.7" transform="rotate(-45 28 28)" />
              <circle cx="28" cy="28" r="3" fill="#8729A0" />
            </motion.svg>
            <span style={{ color:"rgba(135,41,160,0.7)", fontSize:9, letterSpacing:1, fontFamily:"var(--font-inter)", marginTop:2 }}>
              Orda AI · Processing
            </span>
          </div>

          {/* Bottom input bar */}
          <div style={{ background:"rgba(12,12,17,0.98)", backdropFilter:"blur(20px)", borderTop:"0.5px solid rgba(255,255,255,0.07)", padding:"10px 12px", display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
            <div style={{ width:28, height:28, borderRadius:"50%", background:"rgba(255,255,255,0.06)", border:"0.5px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1v10M1 6h10" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div style={{ flex:1, background:"rgba(255,255,255,0.05)", border:"0.5px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"7px 14px" }}>
              <span style={{ color:"rgba(255,255,255,0.4)", fontSize:11, fontFamily:"var(--font-inter)" }}>Message...</span>
            </div>
            <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg, #8729A0, #6a1880)", boxShadow:"0 2px 12px rgba(135,41,160,0.4)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                <rect x="3.5" y="0.5" width="5" height="8" rx="2.5" stroke="white" strokeWidth="1" />
                <path d="M1 7a5 5 0 0 0 10 0" stroke="white" strokeWidth="1" strokeLinecap="round" fill="none" />
                <line x1="6" y1="12" x2="6" y2="13.5" stroke="white" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
