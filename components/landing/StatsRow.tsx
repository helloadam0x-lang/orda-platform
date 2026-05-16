"use client";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

const STATS = [
  { value: "2M+", label: "Messages" },
  { value: "54", label: "Countries" },
  { value: "500+", label: "Businesses" },
];

export default function StatsRow() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-16 px-4">
      <div className="max-w-3xl mx-auto grid grid-cols-3 gap-8">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.12, ease: "easeOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span
              style={{ color: "#8729A0", fontSize: 40, fontWeight: 700, fontFamily: "var(--font-space-grotesk)", lineHeight: 1 }}
            >
              {s.value}
            </span>
            <span
              style={{ color: "#8892A4", fontSize: 13, fontFamily: "var(--font-inter)", letterSpacing: "0.06em", textTransform: "uppercase" }}
            >
              {s.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
