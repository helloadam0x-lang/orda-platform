"use client";

const MESSAGES = [
  { from: "customer", text: "Hi, is the new collection in?" },
  { from: "orda",     text: "Just arrived today. Which category interests you?" },
  { from: "customer", text: "Jackets, size L please" },
  { from: "orda",     text: "We have 3 styles in your size. Shall I send the details?" },
  { from: "customer", text: "Yes!" },
  { from: "orda",     text: "Sending now — I can reserve your favourite instantly." },
];

const customerBubble: React.CSSProperties = {
  background: "rgba(255,255,255,0.08)",
  borderRadius: "18px 18px 18px 4px",
  padding: "10px 14px",
  color: "#E4F0F6",
  fontSize: 13,
  fontFamily: "var(--font-inter)",
  maxWidth: "78%",
  lineHeight: 1.4,
};

const ordaBubble: React.CSSProperties = {
  background: "linear-gradient(135deg, #8729A0, #6a1f80)",
  borderRadius: "18px 18px 4px 18px",
  padding: "10px 14px",
  color: "#fff",
  fontSize: 13,
  fontFamily: "var(--font-inter)",
  maxWidth: "78%",
  lineHeight: 1.4,
};

export default function PhoneMockup() {
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>

      {/* Purple glow */}
      <div style={{
        position: "absolute",
        width: 300, height: 300,
        background: "radial-gradient(circle, rgba(135,41,160,0.19) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(60px)",
        zIndex: 0,
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }} />

      {/* Green glow — bottom right */}
      <div style={{
        position: "absolute",
        width: 180, height: 180,
        background: "radial-gradient(circle, rgba(0,217,126,0.08) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(40px)",
        zIndex: 0,
        bottom: -30, right: -30,
        pointerEvents: "none",
      }} />

      {/* ── Phone shell ── */}
      <div
        className="phone-3d"
        style={{
          position: "relative", zIndex: 1,
          width: 280, height: 580,
          borderRadius: 44,
          background: "linear-gradient(145deg, #1a1a2e 0%, #0A1200 50%, #111111 100%)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 0 0 1px #1a2400, 0 30px 80px rgba(0,0,0,0.8), 0 0 120px rgba(135,41,160,0.145), inset 0 1px 0 rgba(255,255,255,0.08)",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          transition: "transform 0.6s ease",
        }}
      >
        {/* Notch */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 14, flexShrink: 0 }}>
          <div style={{ width: 80, height: 24, background: "#000", borderRadius: 12 }} />
        </div>

        {/* Screen */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Status bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 18px 6px" }}>
            <span style={{ color: "#8892A4", fontSize: 10, fontFamily: "var(--font-inter)", fontWeight: 600 }}>9:41</span>
            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
              {/* Signal */}
              <div style={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
                {[5, 7, 10, 13].map((h, i) => (
                  <div key={i} style={{ width: 3, height: h, background: "#8892A4", borderRadius: 1, opacity: i === 3 ? 0.3 : 1 }} />
                ))}
              </div>
              {/* Battery */}
              <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
                <div style={{ width: 19, height: 10, border: "1.5px solid #8892A4", borderRadius: 2, padding: "1px 1px", display: "flex", alignItems: "center" }}>
                  <div style={{ width: "75%", height: "100%", background: "#8892A4", borderRadius: 1 }} />
                </div>
                <div style={{ width: 2, height: 5, background: "#8892A4", borderRadius: "0 1px 1px 0" }} />
              </div>
            </div>
          </div>

          {/* Chat header */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 14px 10px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #8729A0, #6a1f80)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: "var(--font-space-grotesk)" }}>O</span>
            </div>
            <div>
              <p style={{ color: "#E4F0F6", fontSize: 13, fontWeight: 700, fontFamily: "var(--font-inter)", lineHeight: 1.2, margin: 0 }}>Orda Business</p>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00D97E" }} />
                <span style={{ color: "#8892A4", fontSize: 11, fontFamily: "var(--font-inter)" }}>Online</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7, padding: "10px 12px 6px", overflowY: "hidden" }}>
            {MESSAGES.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.from === "customer" ? "flex-start" : "flex-end" }}>
                <div style={msg.from === "customer" ? customerBubble : ordaBubble}>{msg.text}</div>
              </div>
            ))}

            {/* Typing indicator */}
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: "18px 18px 18px 4px", padding: "11px 14px", display: "flex", gap: 5, alignItems: "center" }}>
                {[0, 0.18, 0.36].map((delay, i) => (
                  <div
                    key={i}
                    className="typing-dot"
                    style={{ width: 7, height: 7, background: "#8892A4", borderRadius: "50%", animationDelay: `${delay}s` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ padding: "6px 12px 16px", display: "flex", flexDirection: "column", gap: 7, flexShrink: 0 }}>
            {/* AI badge */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(0,217,126,0.10)", border: "1px solid rgba(0,217,126,0.30)", borderRadius: 20, padding: "6px 14px" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00D97E" }} />
                <span style={{ color: "#00D97E", fontSize: 11, fontFamily: "var(--font-inter)", fontWeight: 500 }}>Orda AI · Replied in 0.9s</span>
              </div>
            </div>
            {/* Input bar */}
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 20, padding: "9px 16px" }}>
              <span style={{ color: "#8892A4", fontSize: 11, fontFamily: "var(--font-inter)" }}>Message...</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
