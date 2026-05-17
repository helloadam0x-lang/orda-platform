export function formatCurrency(amount: number, symbol = '$'): string {
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(date).toLocaleDateString('en', { month: 'short', day: 'numeric' })
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toString()
}

export function platformColor(platform: string): string {
  const map: Record<string, string> = {
    whatsapp: '#25D366',
    instagram: '#C13584',
    tiktok: '#FE2C55',
    facebook: '#1877F2',
  }
  return map[platform] ?? '#8892A4'
}

export function statusColor(status: string): string {
  const map: Record<string, string> = {
    pending: '#F0A500',
    confirmed: '#1877F2',
    delivered: '#00D97E',
    cancelled: '#ef4444',
    open: '#00D97E',
    resolved: '#8892A4',
    ai_handling: '#8729A0',
  }
  return map[status] ?? '#8892A4'
}
