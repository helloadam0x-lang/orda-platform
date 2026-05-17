"use client";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useStaggerAnimation } from "@/hooks/useStaggerAnimation";

const FEATURES = [
  { title: "Every Language Spoken", icon: "🌍", desc: "Orda detects and replies in 95+ languages automatically. Your customers are always understood." },
  { title: "Always On 24/7", icon: "⚡", desc: "No sick days, no sleep. Every message gets an instant reply, any hour of any day." },
  { title: "Smart Staff Routing", icon: "🎯", desc: "Complex issues are routed to the right team member automatically, with full context." },
  { title: "Complete CRM", icon: "📊", desc: "Every customer, every conversation, every purchase — stored and searchable in one place." },
  { title: "Broadcast Campaigns", icon: "📣", desc: "Send targeted promotions to segmented audiences on WhatsApp and Instagram at once." },
  { title: "Payments Inside Chat", icon: "💳", desc: "Send payment links and receive payments directly inside the conversation. Zero friction." },
  { title: "Delivery Management", icon: "🚚", desc: "Track orders, send updates and handle delivery queries without any human intervention." },
  { title: "Weekly Intelligence", icon: "📈", desc: "Get weekly reports on top questions, sentiment trends and revenue attributed to Orda." },
];

export default function FeaturesSection() {
  const titleRef = useScrollAnimation();
  const cardsRef = useStaggerAnimation(".feature-card");

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div ref={titleRef} className="will-animate text-center mb-14">
          <h2 style={{ color: "#E4F0F6", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, fontFamily: "var(--font-space-grotesk)", marginBottom: 12 }}>
            Built for Businesses That Mean Business
          </h2>
          <p style={{ color: "#8892A4", fontSize: 16, fontFamily: "var(--font-inter)" }}>
            Everything you need to turn messaging into your best sales channel.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="feature-card will-animate"
              style={{ background: "#0A1200", border: "1.5px solid #1a2400", borderRadius: 14, padding: 24, cursor: "default", transition: "border-color 0.3s, transform 0.3s, box-shadow 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(135,41,160,0.4)"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(135,41,160,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#1a2400"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ color: "#E4F0F6", fontSize: 15, fontWeight: 700, fontFamily: "var(--font-space-grotesk)", marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: "#8892A4", fontSize: 13, fontFamily: "var(--font-inter)", lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
