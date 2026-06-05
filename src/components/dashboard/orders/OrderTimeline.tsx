import { formatOrderTime } from '@/lib/format'

const STATUS_STEPS = ['pending', 'confirmed', 'packed', 'out_for_delivery', 'delivered']
const STATUS_LABELS: Record<string, string> = {
  pending: 'Order Received',
  confirmed: 'Confirmed',
  packed: 'Packed',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

interface OrderTimelineProps {
  status: string
  statusHistory?: { status: string; at: string }[]
}

export function OrderTimeline({ status, statusHistory = [] }: OrderTimelineProps) {
  const isCancelled = status === 'cancelled'
  const currentIdx = STATUS_STEPS.indexOf(status)

  const getTime = (s: string) => {
    const entry = statusHistory.find(h => h.status === s)
    return entry ? formatOrderTime(entry.at) : null
  }

  if (isCancelled) {
    return (
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-[var(--r-md)]"
        style={{ background: 'var(--error-dim)', border: '1px solid rgba(239,68,68,0.2)' }}
      >
        <div className="w-3 h-3 rounded-full shrink-0" style={{ background: 'var(--error)' }} />
        <div className="text-[13px] font-semibold" style={{ color: 'var(--error)' }}>Order Cancelled</div>
      </div>
    )
  }

  return (
    <div className="space-y-0">
      {STATUS_STEPS.map((step, i) => {
        const completed = i <= currentIdx
        const current = i === currentIdx
        const time = getTime(step)
        return (
          <div key={step} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                style={{
                  background: completed ? 'var(--accent)' : 'var(--surface-3)',
                  border: `2px solid ${completed ? 'var(--accent)' : 'var(--border)'}`,
                  color: completed ? 'var(--void)' : 'var(--text-3)',
                }}
              >
                {completed ? '✓' : i + 1}
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div
                  className="w-0.5 flex-1"
                  style={{
                    background: completed && i < currentIdx ? 'var(--accent)' : 'var(--border)',
                    minHeight: 20, margin: '3px 0',
                  }}
                />
              )}
            </div>
            <div style={{ paddingBottom: i < STATUS_STEPS.length - 1 ? 16 : 0, paddingTop: 2 }}>
              <div
                className="text-[13px] font-medium"
                style={{ color: completed ? 'var(--text-1)' : 'var(--text-3)' }}
              >
                {STATUS_LABELS[step]}
                {current && <span className="ml-2 text-[11px]" style={{ color: 'var(--accent)' }}>● now</span>}
              </div>
              {time && <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-3)' }}>{time}</div>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
