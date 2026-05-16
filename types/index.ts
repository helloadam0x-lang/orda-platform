export interface Business {
  id: string;
  created_at: string;
  name: string;
  slug: string;
  owner_id: string;
  plan_id: string;
  logo_url: string | null;
  description: string | null;
  industry: string;
  country: string;
  currency: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  timezone: string;
  is_active: boolean;
  trial_ends_at: string | null;
  subscription_id: string | null;
  settings: Record<string, unknown>;
}

export interface Staff {
  id: string;
  created_at: string;
  business_id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "owner" | "admin" | "agent" | "viewer";
  avatar_url: string | null;
  is_active: boolean;
  last_seen_at: string | null;
  permissions: string[];
}

export interface Contact {
  id: string;
  created_at: string;
  business_id: string;
  name: string;
  phone: string;
  email: string | null;
  avatar_url: string | null;
  platform: string;
  platform_id: string | null;
  tags: string[];
  notes: string | null;
  is_blocked: boolean;
  last_contacted_at: string | null;
  metadata: Record<string, unknown>;
}

export interface Conversation {
  id: string;
  created_at: string;
  business_id: string;
  contact_id: string;
  staff_id: string | null;
  platform: string;
  status: "open" | "pending" | "resolved" | "archived";
  subject: string | null;
  last_message_at: string | null;
  unread_count: number;
  is_bot_active: boolean;
  tags: string[];
  metadata: Record<string, unknown>;
}

export interface Message {
  id: string;
  created_at: string;
  conversation_id: string;
  business_id: string;
  sender_type: "contact" | "staff" | "bot";
  sender_id: string;
  content: string;
  type: "text" | "image" | "audio" | "video" | "document" | "location" | "template";
  media_url: string | null;
  is_read: boolean;
  status: "sent" | "delivered" | "read" | "failed";
  metadata: Record<string, unknown>;
}

export interface Broadcast {
  id: string;
  created_at: string;
  business_id: string;
  name: string;
  message: string;
  platform: string;
  status: "draft" | "scheduled" | "sending" | "sent" | "failed";
  recipient_count: number;
  sent_count: number;
  failed_count: number;
  scheduled_at: string | null;
  sent_at: string | null;
  template_id: string | null;
  tags: string[];
  created_by: string;
}

export interface Payment {
  id: string;
  created_at: string;
  business_id: string;
  contact_id: string | null;
  order_id: string | null;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  method: "card" | "bank_transfer" | "mobile_money" | "cash" | "crypto";
  reference: string;
  description: string | null;
  paid_at: string | null;
  metadata: Record<string, unknown>;
}

export interface PlanFeatures {
  textReplies: boolean;
  voiceMessages: boolean;
  humanHandoff: boolean;
  staffRouting: boolean;
  dashboard: boolean;
  crm: boolean;
  broadcast: boolean;
  payments: boolean;
  storefront: boolean;
  weeklyReport: boolean;
  omnichannel: boolean;
  messageLimit: number;
  deliveryManagement: boolean;
  inventoryTracking: boolean;
  multiPlatform: boolean;
}

export interface Plan {
  id: string;
  name: "trial" | "starter" | "growth" | "premium";
  price: number;
  currency: string;
  interval: "month" | "year";
  color: string;
  description: string;
  features: PlanFeatures;
  is_active: boolean;
}

export interface Subscription {
  id: string;
  created_at: string;
  business_id: string;
  plan_id: string;
  plan: Plan;
  status: "active" | "cancelled" | "expired" | "trialing" | "past_due";
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  trial_start: string | null;
  trial_end: string | null;
  metadata: Record<string, unknown>;
}

export interface Partner {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  country: string;
  referral_code: string;
  commission_rate: number;
  total_referrals: number;
  total_earnings: number;
  status: "active" | "pending" | "suspended";
  payout_method: string | null;
  payout_details: Record<string, unknown>;
}

export interface OrderItem {
  id: string;
  product_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes: string | null;
}

export interface Order {
  id: string;
  created_at: string;
  business_id: string;
  contact_id: string;
  staff_id: string | null;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "out_for_delivery"
    | "delivered"
    | "cancelled";
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  currency: string;
  delivery_type: "pickup" | "delivery";
  delivery_address: string | null;
  notes: string | null;
  payment_id: string | null;
  delivery_id: string | null;
}

export interface Delivery {
  id: string;
  created_at: string;
  business_id: string;
  order_id: string;
  driver_id: string | null;
  status: "pending" | "assigned" | "picked_up" | "in_transit" | "delivered" | "failed";
  pickup_address: string;
  delivery_address: string;
  estimated_delivery_at: string | null;
  delivered_at: string | null;
  tracking_code: string;
  notes: string | null;
  metadata: Record<string, unknown>;
}

export interface Notification {
  id: string;
  created_at: string;
  business_id: string;
  user_id: string | null;
  type: "message" | "order" | "payment" | "review" | "broadcast" | "system" | "alert";
  title: string;
  body: string;
  is_read: boolean;
  action_url: string | null;
  metadata: Record<string, unknown>;
}

export interface Review {
  id: string;
  created_at: string;
  business_id: string;
  contact_id: string;
  order_id: string | null;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string | null;
  platform: string;
  is_published: boolean;
  reply: string | null;
  replied_at: string | null;
  replied_by: string | null;
}
