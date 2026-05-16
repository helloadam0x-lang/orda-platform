"use client";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

export default function CtaSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      style={{ background: "#0A1200", borderTop: "1px solid #1a2400", borderBottom: "1px solid #1a2400" }}
      className="py-28 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-8">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: "easeOut" }}
          style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, fontSize: "clamp(30px, 5vw, 52px)", lineHeight: 1.2 }}
        >
          <span style={{ color: "#E4F0F6" }}>The World Is Messaging.</span>
          <br />
          <span style={{ color: "#8729A0" }}>Are You Answering?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
          style={{ color: "#8892A4", fontSize: 17, fontFamily: "var(--font-inter)", lineHeight: 1.7 }}
        >
          Join 500+ businesses in 54 countries who never miss a customer message. Start today — no credit card needed.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.22, ease: "easeOut" }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            background: "#8729A0",
            color: "#E4F0F6",
            border: "none",
            borderRadius: 12,
            padding: "16px 48px",
            fontSize: 17,
            fontWeight: 700,
            fontFamily: "var(--font-inter)",
            cursor: "pointer",
          }}
        >
          Start Free
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.34 }}
          style={{ color: "#8892A4", fontSize: 13, fontFamily: "var(--font-inter)" }}
        >
          No credit card · Setup in 5 minutes · Cancel anytime
        </motion.p>
      </div>
    </section>
  );
}
