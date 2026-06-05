import React from "react";

type LogoVariant = "full" | "icon";
type LogoSize = "sm" | "md" | "lg";

interface OrdaLogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
}

const sizeConfig = {
  sm: { box: 28, fontSize: 14, textClass: "text-sm", subSize: 8, gap: "gap-2" },
  md: { box: 40, fontSize: 20, textClass: "text-base", subSize: 10, gap: "gap-3" },
  lg: { box: 52, fontSize: 26, textClass: "text-xl", subSize: 12, gap: "gap-3" },
};

export default function OrdaLogo({
  variant = "full",
  size = "md",
  className = "",
}: OrdaLogoProps) {
  const cfg = sizeConfig[size];

  return (
    <div className={`flex items-center ${cfg.gap} ${className}`}>
      <div
        style={{
          width: cfg.box,
          height: cfg.box,
          background: "linear-gradient(135deg, #8729A0, #6a1f80)",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: cfg.fontSize,
            color: "#ffffff",
            lineHeight: 1,
          }}
        >
          O
        </span>
      </div>

      {variant === "full" && (
        <div className="flex flex-col">
          <span
            style={{
              fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
              fontWeight: 700,
              letterSpacing: "3px",
              color: "#E4F0F6",
              lineHeight: 1,
              fontSize: cfg.box * 0.425,
            }}
          >
            ORDA
          </span>
          <span
            style={{
              fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
              fontSize: cfg.subSize,
              color: "#8892A4",
              marginTop: "3px",
              letterSpacing: "0.5px",
            }}
          >
            Business Platform
          </span>
        </div>
      )}
    </div>
  );
}
