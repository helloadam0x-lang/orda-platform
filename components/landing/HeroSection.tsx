"use client";
import { useHeroAnimation } from "@/hooks/useHeroAnimation";

const phoneMessages = [
  { from: "customer", text: "Do you have the 256GB model?" },
  { from: "orda", text: "Yes, available in Midnight Black and Silver. Which do you prefer?" },
  { from: "customer", text: "Midnight Black. What is the price?" },
  { from: "orda", text: "$1,250. Want me to send a payment link?" },
];

export default function HeroSection() {
  const ref = useHeroAnimation();

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8 pt-16 pb-16"
      style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(135,41,160,0.08) 0%, #111111 60%)" }}
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* Left */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div
            className="hero-badge will-animate inline-flex items-center mb-8"
            style={{ border: "1px solid rgba(135,41,160,0.25)", background: "rgba(135,41,160,0.06)", color: "#8892A4", fontSize: 12, fontFamily: "var(--font-space-grotesk)", letterSpacing: "1px", padding: "6px 16px", borderRadius: 20 }}
          >
            Trusted by 500+ businesses worldwide
          </div>

          <h1 style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, lineHeight: 1.1, margin: 0 }}>
            <span className="hero-title-1 will-animate block" style={{ color: "#E4F0F6", fontSize: "clamp(40px, 6vw, 72px)" }}>
              Every Customer.
            </span>
            <span className="hero-title-2 will-animate block" style={{ color: "#8729A0", fontSize: "clamp(40px, 6vw, 72px)" }}>
              Always Answered.
            </span>
          </h1>

          <p
            className="hero-sub will-animate"
            style={{ color: "#8892A4", fontSize: "clamp(16px, 2vw, 18px)", maxWidth: 520, marginTop: 24, lineHeight: 1.75, fontFamily: "var(--font-inter)" }}
          >
            Orda connects to WhatsApp, Instagram, TikTok and Facebook and handles every customer message automatically — in any language, at any hour, on any continent.
          </p>

          <div className="hero-buttons will-animate flex flex-col items-center lg:items-start gap-4 mt-10">
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <button
                style={{ background: "#8729A0", color: "#E4F0F6", borderRadius: 10, padding: "14px 28px", fontSize: 15, fontWeight: 700, fontFamily: "var(--font-inter)", border: "none", cursor: "pointer", transition: "transform 0.2s, opacity 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              >
                Start Free Trial
              </button>
              <button
                style={{ background: "transparent", color: "#E4F0F6", borderRadius: 10, padding: "14px 28px", fontSize: 15, fontWeight: 600, fontFamily: "var(--font-inter)", border: "1px solid rgba(135,41,160,0.38)", cursor: "pointer", transition: "border-color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "#8729A0")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(135,41,160,0.38)")}
              >
                Watch Demo
              </button>
            </div>
            <p style={{ color: "#8892A4", fontSize: 12, fontFamily: "var(--font-inter)" }}>
              7-day free trial · No credit card · Setup in 5 minutes
            </p>
          </div>
        </div>

        {/* Phone Mockup */}
        <div
          className="hero-phone will-animate hidden lg:flex flex-col items-center flex-shrink-0"
          style={{ animation: "float 6s ease-in-out infinite" }}
        >
          <div
            style={{ width: 300, background: "#0A1200", border: "1px solid #1a2400", borderRadius: 36, padding: 16, boxShadow: "0 0 80px rgba(135,41,160,0.145)" }}
          >
            <div style={{ padding: "8px 8px 12px", borderBottom: "1px solid #1a2400", marginBottom: 12 }}>
              <div className="flex items-center gap-2">
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#8729A0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "#E4F0F6", fontSize: 13, fontWeight: 700, fontFamily: "var(--font-space-grotesk)" }}>O</span>
                </div>
                <div>
                  <p style={{ color: "#E4F0F6", fontSize: 12, fontWeight: 600, fontFamily: "var(--font-inter)" }}>Orda Business</p>
                  <div className="flex items-center gap-1">
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
                    <span style={{ color: "#8892A4", fontSize: 10, fontFamily: "var(--font-inter)" }}>Online</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 px-1 pb-2">
              {phoneMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "customer" ? "justify-start" : "justify-end"}`}>
                  <div
                    style={{ background: msg.from === "customer" ? "#1a2400" : "#8729A0", color: "#E4F0F6", borderRadius: msg.from === "customer" ? "4px 14px 14px 14px" : "14px 4px 14px 14px", padding: "7px 11px", fontSize: 11, maxWidth: "82%", fontFamily: "var(--font-inter)", lineHeight: 1.5 }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-3 p-2 mx-1 rounded-xl" style={{ background: "#111111", border: "1px solid #1a2400" }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
              <span style={{ color: "#8892A4", fontSize: 10, fontFamily: "var(--font-inter)" }}>
                Orda AI — Replied in 0.9s
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
