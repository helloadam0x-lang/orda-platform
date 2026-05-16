"use client";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

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
          Built for Businesses That Mean Business
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-14"
          style={{ color: "#8892A4", fontSize: 16, fontFamily: "var(--font-inter)" }}
        >
          Everything you need to turn messaging into your best sales channel.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.06 * i, ease: "easeOut" }}
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
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ color: "#E4F0F6", fontSize: 15, fontWeight: 700, fontFamily: "var(--font-space-grotesk)", marginBottom: 8 }}>
                {f.title}
              </h3>
              <p style={{ color: "#8892A4", fontSize: 13, fontFamily: "var(--font-inter)", lineHeight: 1.65 }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
