-- Run in: https://supabase.com/dashboard/project/zscxzwzjcatxvdflgavz/sql/new

-- Add extended columns to conversations
ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add extended columns to orders
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS delivery_address TEXT,
  ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'cash',
  ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid',
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS driver TEXT;

-- BROADCASTS
CREATE TABLE IF NOT EXISTS broadcasts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'all',
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  recipient_count INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE
);
ALTER TABLE broadcasts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "broadcasts_policy" ON broadcasts FOR ALL
  USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

-- BROADCAST CONTACTS (junction)
CREATE TABLE IF NOT EXISTS broadcast_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  broadcast_id UUID REFERENCES broadcasts(id) ON DELETE CASCADE NOT NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE NOT NULL,
  delivered BOOLEAN DEFAULT FALSE,
  opened BOOLEAN DEFAULT FALSE
);
ALTER TABLE broadcast_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "broadcast_contacts_policy" ON broadcast_contacts FOR ALL
  USING (broadcast_id IN (
    SELECT b.id FROM broadcasts b
    JOIN businesses biz ON b.business_id = biz.id
    WHERE biz.user_id = auth.uid()
  ));
