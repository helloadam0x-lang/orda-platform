"use client";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useStaggerAnimation } from "@/hooks/useStaggerAnimation";

const TESTIMONIALS = [
  {
    quote: "Since connecting Orda to our Instagram and WhatsApp, our revenue is up 40%. Customers get answered instantly — even at 2am. I genuinely don't know how we managed before.",
    name: "Sarah M.",
    role: "Boutique Owner, London",
  },
  {
    quote: "We have customers messaging in Arabic, French, Yoruba and English. Orda replies to all of them perfectly. Six languages handled automatically — our support costs dropped by 70%.",
    name: "James K.",
    role: "Electronics Retailer, Dubai",
  },
  {
    quote: "Delivery queries used to flood my DMs every weekend. Now Orda handles every single one. My team focuses on cooking, not typing. Best investment I've made for this restaurant.",
    name: "Amara D.",
    role: "Restaurant Owner, Toronto",
  },
];

export default function TestimonialsSection() {
  const titleRef = useScrollAnimation();
  const cardsRef = useStaggerAnimation(".testimonial-card");

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div ref={titleRef} className="will-animate text-center mb-14">
          <h2 style={{ color: "#E4F0F6", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, fontFamily: "var(--font-space-grotesk)" }}>
            Businesses That Never Look Back
          </h2>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="testimonial-card will-animate"
              style={{ background: "#0A1200", border: "1.5px solid #1a2400", borderRadius: 16, padding: 28 }}
            >
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, j) => (
                  <span key={j} style={{ color: "#8729A0", fontSize: 16 }}>★</span>
                ))}
              </div>
              <p
                style={{ color: "#E4F0F6", fontSize: 14, fontFamily: "var(--font-inter)", fontStyle: "italic", lineHeight: 1.75, marginBottom: 20 }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <p style={{ color: "#E4F0F6", fontSize: 14, fontWeight: 700, fontFamily: "var(--font-inter)" }}>{t.name}</p>
                <p style={{ color: "#8892A4", fontSize: 13, fontFamily: "var(--font-inter)" }}>{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
