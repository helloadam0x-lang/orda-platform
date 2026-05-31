export type OrderStatus = 'pending' | 'confirmed' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled'
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded'
export type DeliveryStatus = 'pending' | 'out_for_delivery' | 'delivered'

export interface OrderItem {
  name: string
  qty: number
  price: number
}

export interface Order {
  id: string
  created_at: string
  order_number: string
  items: OrderItem[]
  total: number
  currency: string
  status: OrderStatus
  payment_status: PaymentStatus
  payment_method: string | null
  delivery_address: string | null
  delivery_status: DeliveryStatus
  notes: string | null
  updated_at: string
  status_history: { status: string; timestamp: string; notes: string }[]
  confirmed_at: string | null
  packed_at: string | null
  dispatched_at: string | null
  delivered_at: string | null
  cancelled_at: string | null
  contact_id: string
  contact_name: string
  contact_phone: string
  contact_is_vip: boolean
  contact_total_orders: number
}

export interface OrderStats {
  total_today: number
  revenue_today: number
  pending_payment: number
  pending_delivery: number
  total_all_time: number
  revenue_all_time: number
}

export const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending:          { bg: 'rgba(212,168,83,0.12)',  text: '#D4A853' },
  confirmed:        { bg: 'rgba(59,130,246,0.12)',  text: '#60a5fa' },
  packed:           { bg: 'rgba(139,92,246,0.12)',  text: '#a78bfa' },
  out_for_delivery: { bg: 'rgba(249,115,22,0.12)',  text: '#fb923c' },
  delivered:        { bg: 'rgba(37,211,102,0.12)',  text: '#25D366' },
  cancelled:        { bg: 'rgba(239,68,68,0.12)',   text: '#f87171' },
  paid:             { bg: 'rgba(37,211,102,0.12)',  text: '#25D366' },
  unpaid:           { bg: 'rgba(239,68,68,0.12)',   text: '#f87171' },
  refunded:         { bg: 'rgba(107,114,128,0.12)', text: '#9ca3af' },
}

export const STATUS_LABELS: Record<string, string> = {
  pending:          'Pending',
  confirmed:        'Confirmed',
  packed:           'Packed',
  out_for_delivery: 'Out for Delivery',
  delivered:        'Delivered',
  cancelled:        'Cancelled',
}
