"use client";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const STATS = [
  { value: "2M+", label: "Messages Handled" },
  { value: "54", label: "Countries Active" },
  { value: "500+", label: "Businesses" },
];

export default function StatsRow() {
  const ref = useScrollAnimation();

  return (
    <section className="py-16 px-4">
      <div ref={ref} className="will-animate max-w-3xl mx-auto">
        <div className="grid grid-cols-3">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-2 py-8"
              style={{ borderRight: i < STATS.length - 1 ? "1px solid #1a2400" : "none" }}
            >
              <span style={{ color: "#8729A0", fontSize: 42, fontWeight: 700, fontFamily: "var(--font-space-grotesk)", lineHeight: 1 }}>
                {s.value}
              </span>
              <span style={{ color: "#8892A4", fontSize: 13, fontFamily: "var(--font-inter)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
