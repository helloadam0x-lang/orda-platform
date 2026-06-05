"use client";

const CITIES = "New York · London · Dubai · Paris · Toronto · Sydney · Singapore · Lagos · Nairobi · Accra · Berlin · Tokyo · ";

export default function Ticker() {
  const content = CITIES.repeat(6);

  return (
    <div
      style={{
        background: "#0A1200",
        borderTop: "1px solid #1a2400",
        borderBottom: "1px solid #1a2400",
        overflow: "hidden",
        padding: "16px 0",
      }}
    >
      <div style={{ display: "flex", width: "max-content", animation: "scrollLeft 25s linear infinite" }}>
        <span style={{ color: "#8892A4", fontSize: 13, letterSpacing: "3px", fontFamily: "var(--font-space-grotesk)", whiteSpace: "nowrap", paddingRight: "4rem" }}>
          {content}
        </span>
        <span style={{ color: "#8892A4", fontSize: 13, letterSpacing: "3px", fontFamily: "var(--font-space-grotesk)", whiteSpace: "nowrap", paddingRight: "4rem" }}>
          {content}
        </span>
      </div>
    </div>
  );
}
