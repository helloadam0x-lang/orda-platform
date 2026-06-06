export interface AdminBusiness {
  id: string
  name: string
  slug: string
  business_type: string
  country: string
  city: string | null
  plan: 'trial' | 'starter' | 'pro'
  plan_expires_at: string | null
  is_active: boolean
  is_whatsapp_connected: boolean
  created_at: string
  updated_at: string
  email?: string | null
  whatsapp_phone?: string | null
}
