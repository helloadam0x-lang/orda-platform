import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { formatCurrency, formatOrderTime } from '@/lib/format'

const STATUS_STEPS = ['pending', 'confirmed', 'packed', 'out_for_delivery', 'delivered']
const STATUS_LABELS: Record<string, string> = {
  pending: 'Order Received', confirmed: 'Confirmed', packed: 'Packed',
  out_for_delivery: 'Out for Delivery', delivered: 'Delivered', cancelled: 'Cancelled',
}

export const dynamic = 'force-dynamic'

export default async function TrackPage({ params }: { params: { orderNumber: string } }) {
  const supabase = createClient()
  const { data: order } = await supabase
    .from('orders')
    .select(`*, businesses(name, slug, whatsapp_phone)`)
    .eq('order_number', params.orderNumber)
    .single()

  if (!order) notFound()

  const currency = order.currency ?? 'USD'
  const biz = order.businesses as any
  const statusIdx = STATUS_STEPS.indexOf(order.status)
  const isCancelled = order.status === 'cancelled'
  const waLink = biz?.whatsapp_phone ? `https://wa.me/${biz.whatsapp_phone.replace(/\D/g, '')}` : null

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF8', color: '#1a1a1a', fontFamily: "'DM Sans', sans-serif" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <header style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.07)' }} className="sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-5 h-14 flex items-center justify-between">
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 20, color: '#111' }}>
            ORDA<span style={{ color: '#D4A853' }}>.</span>
          </span>
          <span style={{ fontSize: 12, color: '#999' }}>Order Tracking</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 py-10 space-y-6">
        <div>
          <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>ORDER</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 28, color: '#D4A853' }}>{order.order_number}</div>
          <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
            Placed {formatOrderTime(order.created_at)} · {biz?.name}
          </div>
        </div>

        {/* Status timeline */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid rgba(0,0,0,0.07)' }}>
          {isCancelled ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>❌</div>
              <div style={{ fontWeight: 700, color: '#EF4444', fontSize: 16 }}>Order Cancelled</div>
              {order.cancellation_reason && <div style={{ fontSize: 13, color: '#999', marginTop: 4 }}>{order.cancellation_reason}</div>}
            </div>
          ) : (
            <div className="space-y-0">
              {STATUS_STEPS.map((step, i) => {
                const isCompleted = i <= statusIdx
                const isCurrent = i === statusIdx
                return (
                  <div key={step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        style={{
                          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                          background: isCompleted ? '#D4A853' : 'rgba(0,0,0,0.08)',
                          border: `2px solid ${isCompleted ? '#D4A853' : 'rgba(0,0,0,0.1)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, color: isCompleted ? '#fff' : '#999',
                          fontWeight: 700,
                        }}
                      >
                        {isCompleted ? '✓' : i + 1}
                      </div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div style={{ width: 2, flex: 1, minHeight: 24, background: isCompleted && i < statusIdx ? '#D4A853' : 'rgba(0,0,0,0.08)', margin: '4px 0' }} />
                      )}
                    </div>
                    <div style={{ paddingBottom: i < STATUS_STEPS.length - 1 ? 20 : 0, paddingTop: 4 }}>
                      <div style={{ fontSize: 14, fontWeight: isCurrent ? 700 : 500, color: isCompleted ? '#111' : '#999' }}>
                        {STATUS_LABELS[step]}
                      </div>
                      {isCurrent && <div style={{ fontSize: 12, color: '#D4A853', marginTop: 2 }}>Current status</div>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Order items */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid rgba(0,0,0,0.07)' }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: '#111' }}>Items</div>
          {((order.items as any[]) ?? []).map((item: any, i: number) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < order.items.length - 1 ? '1px solid rgba(0,0,0,0.05)' : undefined }}>
              <span style={{ fontSize: 13, color: '#333' }}>{item.name} × {item.quantity}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>{formatCurrency(item.price * item.quantity, currency)}</span>
            </div>
          ))}
          {order.delivery_fee > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8 }}>
              <span style={{ fontSize: 13, color: '#666' }}>Delivery</span>
              <span style={{ fontSize: 13, color: '#333' }}>{formatCurrency(order.delivery_fee, currency)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, marginTop: 4, borderTop: '1px solid rgba(0,0,0,0.07)' }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>Total</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 18, color: '#D4A853' }}>{formatCurrency(order.total, currency)}</span>
          </div>
        </div>

        {waLink && (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: '#25D366', color: '#fff', borderRadius: 12, padding: '14px 24px',
              fontWeight: 700, fontSize: 14, textDecoration: 'none',
            }}
          >
            💬 Contact on WhatsApp
          </a>
        )}

        <div style={{ textAlign: 'center', fontSize: 12, color: '#bbb', paddingTop: 16 }}>
          Powered by <a href="https://getorda.app" style={{ color: '#D4A853' }}>Orda</a>
        </div>
      </main>
    </div>
  )
}
