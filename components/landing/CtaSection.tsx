"use client";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function CtaSection() {
  const ref = useScrollAnimation();

  return (
    <section
      style={{ background: "#0A1200", borderTop: "1px solid #1a2400", borderBottom: "1px solid #1a2400" }}
      className="py-28 px-4 sm:px-6 lg:px-8"
    >
      <div ref={ref} className="will-animate max-w-3xl mx-auto flex flex-col items-center text-center gap-8">
        <h2 style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, fontSize: "clamp(30px, 5vw, 52px)", lineHeight: 1.2 }}>
          <span style={{ color: "#E4F0F6" }}>The World Is Messaging.</span>
          <br />
          <span style={{ color: "#8729A0" }}>Are You Answering?</span>
        </h2>

        <p style={{ color: "#8892A4", fontSize: 17, fontFamily: "var(--font-inter)", lineHeight: 1.7 }}>
          Join 500+ businesses in 54 countries who never miss a customer message. Start today — no credit card needed.
        </p>

        <button
          style={{ background: "#8729A0", color: "#E4F0F6", border: "none", borderRadius: 12, padding: "16px 48px", fontSize: 17, fontWeight: 700, fontFamily: "var(--font-inter)", cursor: "pointer", transition: "transform 0.2s, opacity 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
        >
          Start Free
        </button>

        <p style={{ color: "#8892A4", fontSize: 13, fontFamily: "var(--font-inter)" }}>
          No credit card · Setup in 5 minutes · Cancel anytime
        </p>
      </div>
    </section>
  );
}
