"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import OrdaLogo from "@/components/shared/OrdaLogo";

const NAV_LINKS = ["Features", "Pricing", "Partners", "Enterprise"];

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50"
      style={{ background: "rgba(17,17,17,0.9)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderBottom: "1px solid #1a2400" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <OrdaLogo variant="full" size="sm" />
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <Link
              key={l}
              href={`#${l.toLowerCase()}`}
              className="hover:text-[#E4F0F6] transition-colors duration-200"
              style={{ color: "#8892A4", fontSize: 14, fontWeight: 500, fontFamily: "var(--font-inter)" }}
            >
              {l}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="#"
            className="hidden sm:block hover:text-[#E4F0F6] transition-colors duration-200"
            style={{ color: "#8892A4", fontSize: 14, fontFamily: "var(--font-inter)" }}
          >
            Sign in
          </Link>
          <button className="orda-btn-primary" style={{ padding: "8px 20px", fontSize: 14 }}>
            Start Free
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
