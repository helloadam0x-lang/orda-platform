"use client";
import Link from "next/link";

const NAV_LINKS = ["Features", "Pricing", "Partners", "Enterprise"];

export default function Navbar() {
  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-xl"
      style={{ background: "rgba(17,17,17,0.85)", borderBottom: "1px solid #1a2400" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" style={{ textDecoration: "none" }}>
          <span style={{ color: "#E4F0F6", fontSize: 18, fontWeight: 700, fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.02em" }}>
            ORDA
          </span>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#8729A0" }} />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <Link
              key={l}
              href={`#${l.toLowerCase()}`}
              className="transition-colors duration-200"
              style={{ color: "#8892A4", fontSize: 14, fontWeight: 500, fontFamily: "var(--font-inter)", textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#E4F0F6")}
              onMouseLeave={e => (e.currentTarget.style.color = "#8892A4")}
            >
              {l}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="#"
            className="hidden sm:block transition-colors duration-200"
            style={{ color: "#8892A4", fontSize: 14, fontFamily: "var(--font-inter)", textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#E4F0F6")}
            onMouseLeave={e => (e.currentTarget.style.color = "#8892A4")}
          >
            Sign In
          </Link>
          <button
            style={{ background: "#8729A0", color: "#E4F0F6", borderRadius: 8, padding: "8px 20px", fontSize: 14, fontWeight: 600, fontFamily: "var(--font-inter)", border: "none", cursor: "pointer" }}
            className="hover:opacity-90 transition-opacity duration-200"
          >
            Start Free
          </button>
        </div>
      </div>
    </nav>
  );
}
