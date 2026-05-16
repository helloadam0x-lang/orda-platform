"use client";
import { motion } from "framer-motion";

const phoneMessages = [
  { from: "customer", text: "Do you have the 256GB model?" },
  { from: "orda", text: "Yes, available in Midnight Black and Silver. Which do you prefer?" },
  { from: "customer", text: "Midnight Black, what is the price?" },
  { from: "orda", text: "That's $1,250. Want me to send a payment link?" },
];

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-16">
        {/* Left */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1
              className="leading-tight"
              style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700 }}
            >
              <span
                className="block"
                style={{ color: "#E4F0F6", fontSize: "clamp(40px, 6vw, 72px)" }}
              >
                Every Customer.
              </span>
              <span
                className="block"
                style={{ color: "#8729A0", fontSize: "clamp(40px, 6vw, 72px)" }}
              >
                Always Answered.
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            style={{ color: "#8892A4", fontSize: 18, maxWidth: 560, marginTop: 24, lineHeight: 1.7, fontFamily: "var(--font-inter)" }}
          >
            Orda connects to WhatsApp, Instagram, TikTok and Facebook and handles every customer message automatically — in any language, at any hour.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.28 }}
            className="flex flex-wrap gap-4 mt-10 justify-center lg:justify-start"
          >
            <button
              style={{ background: "#8729A0", color: "#E4F0F6", borderRadius: 10, padding: "14px 32px", fontSize: 15, fontWeight: 600, fontFamily: "var(--font-inter)", border: "none", cursor: "pointer" }}
              className="hover:opacity-90 transition-opacity duration-200"
            >
              Start Free Trial
            </button>
            <button
              style={{ background: "transparent", color: "#E4F0F6", borderRadius: 10, padding: "14px 32px", fontSize: 15, fontWeight: 600, fontFamily: "var(--font-inter)", border: "1.5px solid #8729A0", cursor: "pointer" }}
              className="hover:bg-[#8729A0]/10 transition-colors duration-200"
            >
              Watch Demo
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.42 }}
            style={{ color: "#8892A4", fontSize: 12, marginTop: 16, fontFamily: "var(--font-inter)" }}
          >
            7-day free trial · No credit card · Setup in 5 minutes
          </motion.p>
        </div>

        {/* Right — Phone Mockup */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="hidden lg:flex flex-col items-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 280,
              background: "#0A1200",
              border: "1.5px solid #1a2400",
              borderRadius: 32,
              padding: "20px 12px",
              boxShadow: "0 32px 80px rgba(135, 41, 160, 0.18), 0 8px 32px rgba(0,0,0,0.6)",
            }}
          >
            {/* Phone top bar */}
            <div className="flex items-center gap-3 px-2 pb-4 border-b" style={{ borderColor: "#1a2400" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#8729A0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#E4F0F6", fontSize: 14, fontWeight: 700, fontFamily: "var(--font-space-grotesk)" }}>O</span>
              </div>
              <div>
                <p style={{ color: "#E4F0F6", fontSize: 13, fontWeight: 600, fontFamily: "var(--font-inter)" }}>Orda AI</p>
                <p style={{ color: "#8892A4", fontSize: 11, fontFamily: "var(--font-inter)" }}>WhatsApp Business</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex flex-col gap-3 py-4">
              {phoneMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.18, duration: 0.4 }}
                  className={`flex ${msg.from === "customer" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    style={{
                      background: msg.from === "customer" ? "#1a2400" : "#8729A0",
                      color: "#E4F0F6",
                      borderRadius: msg.from === "customer" ? "4px 14px 14px 14px" : "14px 4px 14px 14px",
                      padding: "8px 12px",
                      fontSize: 12,
                      maxWidth: "80%",
                      fontFamily: "var(--font-inter)",
                      lineHeight: 1.5,
                    }}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Badge */}
            <div
              className="flex items-center gap-2 mx-2 mt-1 p-2 rounded-xl"
              style={{ background: "#111111", border: "1px solid #1a2400" }}
            >
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
              <span style={{ color: "#8892A4", fontSize: 11, fontFamily: "var(--font-inter)" }}>
                Orda AI — Replied in 0.9s
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
