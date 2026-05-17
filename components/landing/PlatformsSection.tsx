"use client";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useStaggerAnimation } from "@/hooks/useStaggerAnimation";

const PLATFORMS = [
  { name: "WhatsApp", icon: "💬", desc: "Connect your WhatsApp Business number and reply to every message automatically." },
  { name: "Instagram", icon: "📸", desc: "Handle DMs and story replies from your Instagram business profile." },
  { name: "TikTok", icon: "🎵", desc: "Respond to DMs and comments as your TikTok audience grows overnight." },
  { name: "Facebook", icon: "📘", desc: "Automate Messenger conversations and page comment replies." },
  { name: "Telegram", icon: "✈️", desc: "Manage customer conversations on Telegram with instant AI responses." },
  { name: "SMS", icon: "📱", desc: "Reach customers who prefer traditional text messaging, fully automated." },
];

export default function PlatformsSection() {
  const titleRef = useScrollAnimation();
  const cardsRef = useStaggerAnimation(".platform-card");

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div ref={titleRef} className="will-animate text-center mb-14">
          <h2 style={{ color: "#E4F0F6", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, fontFamily: "var(--font-space-grotesk)", marginBottom: 12 }}>
            One Inbox. Every Platform.
          </h2>
          <p style={{ color: "#8892A4", fontSize: 16, fontFamily: "var(--font-inter)" }}>
            All your customer conversations in one intelligent inbox.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PLATFORMS.map((p) => (
            <div
              key={p.name}
              className="platform-card will-animate"
              style={{ background: "#0A1200", border: "1.5px solid #1a2400", borderRadius: 14, padding: 24, cursor: "default", transition: "border-color 0.3s, transform 0.3s, box-shadow 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(135,41,160,0.4)"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(135,41,160,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#1a2400"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span style={{ fontSize: 28 }}>{p.icon}</span>
                <span style={{ color: "#E4F0F6", fontSize: 16, fontWeight: 700, fontFamily: "var(--font-space-grotesk)" }}>{p.name}</span>
              </div>
              <p style={{ color: "#8892A4", fontSize: 13, fontFamily: "var(--font-inter)", lineHeight: 1.65 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
