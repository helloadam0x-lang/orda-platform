export function formatCurrency(amount: number, currency = 'USD'): string {
  return `${currency} ${Number(amount).toLocaleString()}`
}

export function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function formatOrderTime(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-UG', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
    timeZone: 'Africa/Kampala',
  })
}

export function getAvatarGradient(name: string): string {
  const palette = [
    'linear-gradient(135deg,#D4A853,#A07830)',
    'linear-gradient(135deg,#25D366,#128C7E)',
    'linear-gradient(135deg,#6366f1,#4338ca)',
    'linear-gradient(135deg,#f59e0b,#d97706)',
    'linear-gradient(135deg,#ef4444,#dc2626)',
    'linear-gradient(135deg,#8b5cf6,#7c3aed)',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return palette[Math.abs(hash) % palette.length]
}
