-- Run this in: https://supabase.com/dashboard/project/zscxzwzjcatxvdflgavz/sql/new

-- CONTACTS
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  platform TEXT NOT NULL DEFAULT 'whatsapp',
  tags TEXT[] DEFAULT '{}',
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contacts_policy" ON contacts FOR ALL
  USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

-- CONVERSATIONS
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL DEFAULT 'whatsapp',
  status TEXT NOT NULL DEFAULT 'open',
  is_ai_handling BOOLEAN DEFAULT TRUE,
  last_message TEXT,
  unread_count INTEGER DEFAULT 0
);
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "conversations_policy" ON conversations FOR ALL
  USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

-- MESSAGES
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  sender_type TEXT NOT NULL DEFAULT 'customer'
);
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "messages_policy" ON messages FOR ALL
  USING (conversation_id IN (
    SELECT c.id FROM conversations c
    JOIN businesses b ON c.business_id = b.id
    WHERE b.user_id = auth.uid()
  ));

-- ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE NOT NULL,
  order_number TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending'
);
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_policy" ON orders FOR ALL
  USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

-- PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending'
);
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "payments_policy" ON payments FOR ALL
  USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

-- Extend businesses table with AI/settings columns
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS ai_personality TEXT DEFAULT 'friendly',
  ADD COLUMN IF NOT EXISTS auto_reply BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS greeting_message TEXT,
  ADD COLUMN IF NOT EXISTS business_hours_open TEXT DEFAULT '08:00',
  ADD COLUMN IF NOT EXISTS business_hours_close TEXT DEFAULT '18:00',
  ADD COLUMN IF NOT EXISTS notify_new_message BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS notify_new_order BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS notify_payment BOOLEAN DEFAULT TRUE;
