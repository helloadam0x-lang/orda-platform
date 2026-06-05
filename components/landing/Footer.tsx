"use client";

const LINKS = {
  Product: ["Features", "Pricing", "Integrations", "Changelog", "Roadmap"],
  Company: ["About", "Blog", "Careers", "Press", "Partners"],
  Support: ["Help Center", "Contact Us", "Privacy Policy", "Terms of Service", "Status"],
};

export default function Footer() {
  return (
    <footer style={{ background: "#0A1200", borderTop: "1px solid #1a2400" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Logo + Tagline */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span
                style={{
                  color: "#E4F0F6",
                  fontSize: 22,
                  fontWeight: 700,
                  fontFamily: "var(--font-space-grotesk)",
                  letterSpacing: "-0.02em",
                }}
              >
                ORDA
              </span>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#8729A0" }} />
            </div>
            <p style={{ color: "#8892A4", fontSize: 13, fontFamily: "var(--font-inter)", lineHeight: 1.7, maxWidth: 220 }}>
              The global AI business platform that answers every customer message — automatically.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([col, items]) => (
            <div key={col}>
              <p style={{ color: "#E4F0F6", fontSize: 13, fontWeight: 700, fontFamily: "var(--font-inter)", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {col}
              </p>
              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      style={{ color: "#8892A4", fontSize: 13, fontFamily: "var(--font-inter)", textDecoration: "none" }}
                      className="hover:text-[#E4F0F6] transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: "1px solid #1a2400" }}
        >
          <p style={{ color: "#8892A4", fontSize: 12, fontFamily: "var(--font-inter)" }}>
            © {new Date().getFullYear()} Orda Technologies. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e" }} />
            <p style={{ color: "#8892A4", fontSize: 12, fontFamily: "var(--font-inter)" }}>
              Active in 54 countries
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
