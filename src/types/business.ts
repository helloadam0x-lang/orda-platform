export interface Business {
  id: string
  user_id: string
  name: string
  slug: string
  business_type: string
  country: string
  city: string
  currency: string
  whatsapp_phone: string | null
  notification_phone: string | null
  tagline: string | null
  logo_url: string | null
  description: string | null
  ai_personality: 'professional' | 'friendly' | 'luxury'
  ai_firmness: 'soft' | 'balanced' | 'firm' | 'strict'
  ai_greeting: string | null
  ai_custom_rules: string | null
  allow_discounts: boolean
  max_discount_percent: number
  auto_reply: boolean
  is_active: boolean
  is_whatsapp_connected: boolean
  wa_phone: string | null
  plan: 'trial' | 'starter' | 'pro'
  plan_expires_at: string | null
  referral_code: string
  store_active: boolean
  website_active: boolean
  opening_hours: Record<string, { open: string; close: string; closed: boolean }> | null
  payment_instructions: string | null
  momo_number: string | null
  momo_name: string | null
  momo_provider: string | null
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  business_id: string
  name: string
  description: string | null
  price: number
  compare_at_price: number | null
  category: string | null
  image_url: string | null
  images: string[]
  stock: number | null
  track_stock: boolean
  is_active: boolean
  is_featured: boolean
  on_sale: boolean
  variants: ProductVariantGroup[]
  created_at: string
}

export interface ProductVariantGroup {
  name: string
  options: string[]
}

export interface DeliveryZone {
  id: string
  business_id: string
  name: string
  fee: number
  estimated_time: string
  is_active: boolean
}

export interface WebsiteConfig {
  id: string
  business_id: string
  theme: string
  published: boolean
  hero_headline: string | null
  hero_subtext: string | null
  hero_image_url: string | null
  about_text: string | null
  features: { title: string; description: string; icon: string }[]
  faq: { question: string; answer: string }[]
  seo_title: string | null
  seo_description: string | null
  gallery_urls: string[]
  sections_enabled: {
    products: boolean
    about: boolean
    features: boolean
    gallery: boolean
    reviews: boolean
    faq: boolean
    contact: boolean
  }
  accent_color: string | null
  announcement_text: string | null
  announcement_active: boolean
}

export interface StaffMember {
  id: string
  business_id: string
  name: string
  phone: string | null
  role: 'manager' | 'delivery' | 'cashier'
  is_active: boolean
  staff_code: string
}

export interface DiscountCode {
  id: string
  business_id: string
  code: string
  type: 'percent' | 'fixed'
  value: number
  min_order: number | null
  max_uses: number | null
  uses_count: number
  expires_at: string | null
  is_active: boolean
}
