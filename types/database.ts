export type Platform = 'whatsapp' | 'instagram' | 'tiktok' | 'facebook'
export type ConversationStatus = 'open' | 'resolved' | 'ai_handling'
export type OrderStatus = 'pending' | 'confirmed' | 'delivered' | 'cancelled'
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
  unread_count: number
  contact?: Pick<Contact, 'name' | 'platform'> | null
}

export interface Message {
  id: string
  created_at: string
  conversation_id: string
  content: string
  sender_type: SenderType
}

export interface Order {
  id: string
  created_at: string
  business_id: string
  contact_id: string
  order_number: string
  amount: number
  status: OrderStatus
  contact?: Pick<Contact, 'name'> | null
}

export interface Payment {
  id: string
  created_at: string
  business_id: string
  order_id: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
}

export interface DayActivity {
  day: string
  messages: number
}
