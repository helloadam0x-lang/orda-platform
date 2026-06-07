import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        surface: '#080808',
        elevated: '#0F0F10',
        obsidian: '#050505',
        'infra-green': '#00FF66',
        'infra-amber': '#F59E0B',
        'infra-red': '#FF3B30',
        'infra-blue': '#0A84FF',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-geist-sans)', 'DM Sans', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'JetBrains Mono', 'Consolas', 'monospace'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'marquee-infra': 'marquee-infra 40s linear infinite',
        'node-pulse': 'node-pulse 2s ease-in-out infinite',
        'packet-travel': 'packet-travel 3s ease-in-out infinite',
      },
      keyframes: {
        'marquee-infra': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'node-pulse': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.3)' },
        },
        'packet-travel': {
          '0%': { opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
export default config
