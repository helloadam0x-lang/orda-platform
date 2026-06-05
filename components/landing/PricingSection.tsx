"use client";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useStaggerAnimation } from "@/hooks/useStaggerAnimation";

const PLANS = [
  {
    name: "Trial",
    price: "$0",
    period: "7 days",
    highlight: false,
    features: ["1 platform", "Up to 200 messages", "Basic AI replies", "Email support"],
  },
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    highlight: false,
    features: ["2 platforms", "Unlimited messages", "Full AI replies", "CRM access", "Email & chat support"],
  },
  {
    name: "Growth",
    price: "$59",
    period: "/month",
    highlight: true,
    badge: "Most Popular",
    features: ["4 platforms", "Unlimited messages", "Broadcasts & campaigns", "Payment links", "Staff routing", "Priority support"],
  },
  {
    name: "Premium",
    price: "$99",
    period: "/month",
    highlight: false,
    features: ["All platforms", "Unlimited messages", "Delivery management", "Weekly intelligence", "Custom AI training", "Dedicated support"],
  },
];

export default function PricingSection() {
  const titleRef = useScrollAnimation();
  const cardsRef = useStaggerAnimation(".pricing-card");

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div ref={titleRef} className="will-animate text-center mb-14">
          <h2 style={{ color: "#E4F0F6", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, fontFamily: "var(--font-space-grotesk)", marginBottom: 12 }}>
            Simple Pricing. Always.
          </h2>
          <p style={{ color: "#8892A4", fontSize: 16, fontFamily: "var(--font-inter)" }}>No surprises. No hidden fees.</p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className="pricing-card will-animate"
              style={{
                background: "#0A1200",
                border: `1.5px solid ${plan.highlight ? "#8729A0" : "#1a2400"}`,
                borderRadius: 16,
                padding: 28,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                transform: plan.highlight ? "scale(1.04)" : "scale(1)",
              }}
            >
              {plan.badge && (
                <div
                  style={{
                    position: "absolute",
                    top: -13,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#8729A0",
                    color: "#E4F0F6",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "4px 14px",
                    borderRadius: 20,
                    fontFamily: "var(--font-inter)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {plan.badge}
                </div>
              )}

              <p style={{ color: "#8892A4", fontSize: 13, fontFamily: "var(--font-inter)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                {plan.name}
              </p>
              <div className="flex items-end gap-1 mb-6">
                <span style={{ color: "#E4F0F6", fontSize: 48, fontWeight: 700, fontFamily: "var(--font-space-grotesk)", lineHeight: 1 }}>
                  {plan.price}
                </span>
                <span style={{ color: "#8892A4", fontSize: 13, fontFamily: "var(--font-inter)", paddingBottom: 6 }}>
                  {plan.period}
                </span>
              </div>

              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span style={{ color: "#8729A0", fontSize: 14, marginTop: 1, flexShrink: 0 }}>✓</span>
                    <span style={{ color: "#8892A4", fontSize: 13, fontFamily: "var(--font-inter)" }}>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                style={{
                  width: "100%",
                  background: plan.highlight ? "#8729A0" : "transparent",
                  color: "#E4F0F6",
                  border: `1.5px solid ${plan.highlight ? "#8729A0" : "#1a2400"}`,
                  borderRadius: 10,
                  padding: "12px 0",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "var(--font-inter)",
                  cursor: "pointer",
                }}
                className="hover:opacity-80 transition-opacity duration-200"
              >
                {plan.price === "$0" ? "Start Free Trial" : "Get Started"}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center mt-8" style={{ color: "#8892A4", fontSize: 13, fontFamily: "var(--font-inter)" }}>
          $25 one-time setup · Cancel anytime · 7-day free trial
        </p>
      </div>
    </section>
  );
}
