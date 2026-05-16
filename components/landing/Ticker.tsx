"use client";

const CITIES = "New York · London · Dubai · Paris · Toronto · Sydney · Singapore · Lagos · Nairobi · Accra · ";

export default function Ticker() {
  return (
    <div
      style={{
        background: "#0A1200",
        borderTop: "1px solid #1a2400",
        borderBottom: "1px solid #1a2400",
        overflow: "hidden",
        whiteSpace: "nowrap",
        padding: "14px 0",
      }}
    >
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-inner {
          display: inline-block;
          animation: ticker 28s linear infinite;
        }
      `}</style>
      <div className="ticker-inner">
        {[...Array(4)].map((_, i) => (
          <span
            key={i}
            style={{
              color: "#8892A4",
              fontSize: 13,
              letterSpacing: "0.14em",
              fontFamily: "var(--font-inter)",
              paddingRight: "2rem",
            }}
          >
            {CITIES}
          </span>
        ))}
      </div>
    </div>
  );
}
