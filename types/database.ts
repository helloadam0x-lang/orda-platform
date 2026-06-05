export interface ProductItem {
  name: string
  description?: string
  price: number
}

export type Platform = 'whatsapp' | 'instagram' | 'tiktok' | 'facebook'
export type ConversationStatus = 'open' | 'resolved' | 'ai_handling' | 'human'
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled'
export type PaymentStatus = 'unpaid' | 'paid' | 'partial'
export type BroadcastStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed'
export type SenderType = 'customer' | 'business' | 'ai'

export interface Business {
  id: string
  created_at: string
  user_id: string
  name: string
  phone: string | null
  email: string | null
  country: string
  plan: string
  plan_expires_at: string
  whatsapp_connected: boolean
  instagram_connected: boolean
  tiktok_connected: boolean
  facebook_connected: boolean
  is_active: boolean
  ai_personality?: string | null
  auto_reply?: boolean | null
  greeting_message?: string | null
  business_hours_open?: string | null
  business_hours_close?: string | null
  notify_new_message?: boolean | null
  notify_new_order?: boolean | null
  notify_payment?: boolean | null
  slug?: string | null
  description?: string | null
  products?: ProductItem[] | null
  greeting?: string | null
  ai_instructions?: string | null
  chat_accent?: string | null
}

export interface Contact {
  id: string
  created_at: string
  business_id: string
  name: string
  phone: string | null
  email: string | null
  platform: Platform
  tags: string[] | null
  total_orders: number
  total_spent: number
  last_active: string | null
}

export interface Conversation {
  id: string
  created_at: string
  business_id: string
  contact_id: string
  platform: Platform
  status: ConversationStatus
  is_ai_handling: boolean
  last_message: string | null
  last_message_at?: string | null
  unread_count: number
  contact?: Pick<Contact, 'name' | 'platform' | 'phone' | 'email' | 'total_orders' | 'total_spent' | 'last_active' | 'tags'> | null
}

export interface Message {
  id: string
  created_at: string
  conversation_id: string
  content: string
  sender_type: SenderType
}

export interface OrderItem {
  name: string
  quantity: number
  unit_price: number
}

export interface Order {
  id: string
  created_at: string
  business_id: string
  contact_id: string
  order_number: string
  amount: number
  status: OrderStatus
  items?: OrderItem[] | null
  delivery_address?: string | null
  delivery_fee?: number | null
  payment_method?: string | null
  payment_status?: PaymentStatus | null
  notes?: string | null
  driver?: string | null
  contact?: Pick<Contact, 'name' | 'phone' | 'platform'> | null
}

export interface Payment {
  id: string
  created_at: string
  business_id: string
  order_id: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
}

export interface Broadcast {
  id: string
  created_at: string
  business_id: string
  title: string
  platform: string
  message: string
  status: BroadcastStatus
  recipient_count: number
  sent_count: number
  delivered_count: number
  scheduled_at: string | null
  sent_at: string | null
}

export interface DayActivity {
  day: string
  messages: number
  ai_replies?: number
  revenue?: number
}

export interface AdminBusiness {
  id: string
  created_at: string
  name: string
  email: string | null
  phone: string | null
  country: string
  plan: string
  plan_expires_at: string
  is_active: boolean
  whatsapp_connected: boolean
  instagram_connected: boolean
  tiktok_connected: boolean
  facebook_connected: boolean
}

export interface ConvFilterCounts {
  all: number
  open: number
  ai_handling: number
  human: number
  resolved: number
}

export interface ChatSession {
  id: string
  created_at: string
  business_id: string
  visitor_name: string | null
  visitor_phone: string | null
  visitor_language: string
  platform: string
  status: string
  last_message_at: string
}

export interface ChatMessage {
  id: string
  created_at: string
  session_id: string
  business_id: string
  role: string
  content: string
  is_ai: boolean
}

