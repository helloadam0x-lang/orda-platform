"use client";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

const STEPS = [
  {
    num: "01",
    title: "Connect",
    desc: "Scan a QR code to link your WhatsApp, Instagram, TikTok, or Facebook account. Takes under 60 seconds.",
  },
  {
    num: "02",
    title: "Configure",
    desc: "Add your business details, products, FAQs and tone. Orda learns your brand in minutes.",
  },
  {
    num: "03",
    title: "Grow",
    desc: "Every message is answered automatically — any language, any hour. Watch your revenue grow.",
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="features" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
          style={{ color: "#E4F0F6", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, fontFamily: "var(--font-space-grotesk)" }}
        >
          Up and Running in 5 Minutes
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.1 + i * 0.15, ease: "easeOut" }}
              className="flex flex-col items-center text-center gap-5"
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "#8729A0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span style={{ color: "#E4F0F6", fontSize: 18, fontWeight: 700, fontFamily: "var(--font-space-grotesk)" }}>
                  {step.num}
                </span>
              </div>
              <h3 style={{ color: "#E4F0F6", fontSize: 20, fontWeight: 700, fontFamily: "var(--font-space-grotesk)" }}>
                {step.title}
              </h3>
              <p style={{ color: "#8892A4", fontSize: 14, fontFamily: "var(--font-inter)", lineHeight: 1.7 }}>
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
