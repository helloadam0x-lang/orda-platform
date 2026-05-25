import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0F',
        accent: '#8729A0',
        'accent-light': '#c084fc',
        'text-primary': '#FAFAFA',
        'text-muted': 'rgba(255,255,255,0.45)',
        border: 'rgba(255,255,255,0.08)',
        glass: 'rgba(255,255,255,0.03)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'purple-glow': 'radial-gradient(ellipse at center, rgba(135,41,160,0.4) 0%, transparent 70%)',
        'hero-glow': 'radial-gradient(ellipse 80% 50% at 70% 50%, rgba(135,41,160,0.25) 0%, transparent 60%)',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulse_ring: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(1.15)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        typing_dot: {
          '0%, 80%, 100%': { opacity: '0', transform: 'scale(0.7)' },
          '40%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.5s ease-in-out infinite',
        ticker: 'ticker 30s linear infinite',
        pulse_ring: 'pulse_ring 2s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        typing_dot: 'typing_dot 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
export default config
