import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./store/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "orda-black": "#111111",
        "orda-surface": "#0A1200",
        "orda-elevated": "#0f1a00",
        "orda-border": "#1a2400",
        "orda-gold": "#8729A0",
        "orda-light": "#E4F0F6",
        "orda-white": "#E4F0F6",
        "orda-grey": "#8892A4",
      },
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
        "space-grotesk": ["var(--font-space-grotesk)", "sans-serif"],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px #8729A040" },
          "50%": { boxShadow: "0 0 40px #8729A080" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease forwards",
        slideUp: "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        glowPulse: "glowPulse 2s ease-in-out infinite",
      },
      boxShadow: {
        "glow-primary": "0 0 40px #8729A025",
        "glow-light": "0 0 30px #E4F0F620",
        card: "0 8px 32px #00000060, inset 0 1px 0 #ffffff06",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
