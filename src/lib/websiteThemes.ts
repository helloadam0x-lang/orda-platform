export interface WebsiteTheme {
  id: string
  name: string
  description: string
  vars: Record<string, string>
}

export const WEBSITE_THEMES: WebsiteTheme[] = [
  {
    id: 'luxe',
    name: 'Luxe',
    description: 'Dark, editorial, premium',
    vars: {
      '--site-bg': '#0A0A0A',
      '--site-surface': '#111111',
      '--site-accent': '#D4A853',
      '--site-accent-light': '#E8C070',
      '--site-text': '#F0F0F0',
      '--site-text-2': 'rgba(240,240,240,0.6)',
      '--site-border': 'rgba(255,255,255,0.08)',
      '--site-radius': '8px',
    },
  },
  {
    id: 'fresh',
    name: 'Fresh',
    description: 'Clean, bright, modern',
    vars: {
      '--site-bg': '#FAFAFA',
      '--site-surface': '#FFFFFF',
      '--site-accent': '#16A34A',
      '--site-accent-light': '#22C55E',
      '--site-text': '#111111',
      '--site-text-2': 'rgba(17,17,17,0.6)',
      '--site-border': 'rgba(0,0,0,0.08)',
      '--site-radius': '12px',
    },
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Vibrant, high contrast, energetic',
    vars: {
      '--site-bg': '#FFFFFF',
      '--site-surface': '#F8F8F8',
      '--site-accent': '#EF4444',
      '--site-accent-light': '#F87171',
      '--site-text': '#0A0A0A',
      '--site-text-2': 'rgba(10,10,10,0.6)',
      '--site-border': 'rgba(0,0,0,0.1)',
      '--site-radius': '6px',
    },
  },
  {
    id: 'trust',
    name: 'Trust',
    description: 'Professional, corporate, reliable',
    vars: {
      '--site-bg': '#F0F4F8',
      '--site-surface': '#FFFFFF',
      '--site-accent': '#1D4ED8',
      '--site-accent-light': '#3B82F6',
      '--site-text': '#1E293B',
      '--site-text-2': 'rgba(30,41,59,0.6)',
      '--site-border': 'rgba(30,41,59,0.1)',
      '--site-radius': '8px',
    },
  },
  {
    id: 'warm',
    name: 'Warm',
    description: 'Inviting, cozy, community-feel',
    vars: {
      '--site-bg': '#FFF8F0',
      '--site-surface': '#FFFFFF',
      '--site-accent': '#EA580C',
      '--site-accent-light': '#F97316',
      '--site-text': '#1C1917',
      '--site-text-2': 'rgba(28,25,23,0.6)',
      '--site-border': 'rgba(28,25,23,0.08)',
      '--site-radius': '14px',
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra clean, typography-first',
    vars: {
      '--site-bg': '#FFFFFF',
      '--site-surface': '#F9F9F9',
      '--site-accent': '#000000',
      '--site-accent-light': '#333333',
      '--site-text': '#000000',
      '--site-text-2': 'rgba(0,0,0,0.5)',
      '--site-border': 'rgba(0,0,0,0.06)',
      '--site-radius': '4px',
    },
  },
]

export function getTheme(id: string): WebsiteTheme {
  return WEBSITE_THEMES.find(t => t.id === id) ?? WEBSITE_THEMES[0]
}

export function themeToCSS(theme: WebsiteTheme): string {
  return Object.entries(theme.vars)
    .map(([k, v]) => `${k}:${v}`)
    .join(';')
}
