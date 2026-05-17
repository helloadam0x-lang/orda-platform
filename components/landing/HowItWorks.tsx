"use client";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useStaggerAnimation } from "@/hooks/useStaggerAnimation";

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
  const titleRef = useScrollAnimation();
  const stepsRef = useStaggerAnimation(".step-card");

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div ref={titleRef} className="will-animate text-center mb-16">
          <h2 style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, fontSize: "clamp(28px, 4vw, 48px)" }}>
            <span style={{ color: "#E4F0F6" }}>Up and Running</span>{" "}
            <span style={{ color: "#8729A0" }}>in 5 Minutes</span>
          </h2>
        </div>

        <div ref={stepsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="step-card will-animate flex flex-col items-center text-center gap-5"
              style={{ background: "#0A1200", border: "1.5px solid #1a2400", borderRadius: 16, padding: 28 }}
            >
              <div
                style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, #8729A0, #6a1f80)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
