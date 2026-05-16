"use client";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

const PLATFORMS = [
  { name: "WhatsApp", icon: "💬", desc: "Connect your WhatsApp Business number and reply to every message automatically." },
  { name: "Instagram", icon: "📸", desc: "Handle DMs and story replies from your Instagram business profile." },
  { name: "TikTok", icon: "🎵", desc: "Respond to DMs and comments as your TikTok audience grows overnight." },
  { name: "Facebook", icon: "📘", desc: "Automate Messenger conversations and page comment replies." },
  { name: "Telegram", icon: "✈️", desc: "Manage customer conversations on Telegram with instant AI responses." },
  { name: "SMS", icon: "📱", desc: "Reach customers who prefer traditional text messaging, fully automated." },
];

export default function PlatformsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-4"
          style={{ color: "#E4F0F6", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, fontFamily: "var(--font-space-grotesk)" }}
        >
          One Inbox. Every Platform.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-14"
          style={{ color: "#8892A4", fontSize: 16, fontFamily: "var(--font-inter)" }}
        >
          All your customer conversations in one intelligent inbox.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PLATFORMS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.08 * i, ease: "easeOut" }}
              whileHover={{ y: -3, borderColor: "rgba(135, 41, 160, 0.4)" }}
              style={{
                background: "#0A1200",
                border: "1.5px solid #1a2400",
                borderRadius: 14,
                padding: 24,
                cursor: "default",
                transition: "border-color 0.2s, transform 0.2s",
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span style={{ fontSize: 28 }}>{p.icon}</span>
                <span style={{ color: "#E4F0F6", fontSize: 16, fontWeight: 700, fontFamily: "var(--font-space-grotesk)" }}>
                  {p.name}
                </span>
              </div>
              <p style={{ color: "#8892A4", fontSize: 13, fontFamily: "var(--font-inter)", lineHeight: 1.65 }}>
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
