-- ============================================================
-- Orda AI Chat Engine — Complete Database Setup
-- Run this ONCE in: https://supabase.com/dashboard/project/zscxzwzjcatxvdflgavz/sql/new
-- ============================================================

-- STEP 1: Extend businesses table with chat fields
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS products JSONB DEFAULT '[]';
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS greeting TEXT DEFAULT 'Hello! How can I help you today?';
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS ai_instructions TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS chat_accent TEXT DEFAULT '#8729A0';

-- STEP 2: Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  visitor_name TEXT,
  visitor_phone TEXT,
  visitor_language TEXT DEFAULT 'en',
  platform TEXT DEFAULT 'web',
  status TEXT DEFAULT 'active',
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 3: Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  is_ai BOOLEAN DEFAULT FALSE
);

-- STEP 4: Enable RLS
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- STEP 5: RLS Policies (idempotent)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'chat_sessions_public' AND tablename = 'chat_sessions') THEN
    CREATE POLICY chat_sessions_public ON chat_sessions FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'chat_sessions_select' AND tablename = 'chat_sessions') THEN
    CREATE POLICY chat_sessions_select ON chat_sessions FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'chat_sessions_update' AND tablename = 'chat_sessions') THEN
    CREATE POLICY chat_sessions_update ON chat_sessions FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'chat_messages_public' AND tablename = 'chat_messages') THEN
    CREATE POLICY chat_messages_public ON chat_messages FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'chat_messages_select' AND tablename = 'chat_messages') THEN
    CREATE POLICY chat_messages_select ON chat_messages FOR SELECT USING (true);
  END IF;
END $$;

-- STEP 6: Indexes
CREATE INDEX IF NOT EXISTS chat_sessions_business_id_idx ON chat_sessions(business_id);
CREATE INDEX IF NOT EXISTS chat_messages_session_id_idx ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS businesses_slug_idx ON businesses(slug);

-- STEP 7: Grant REST API access (critical — without this PostgREST can't expose the tables)
GRANT SELECT, INSERT, UPDATE ON chat_sessions TO anon, authenticated;
GRANT SELECT, INSERT ON chat_messages TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- STEP 8: Seed demo business (upsert — safe to run multiple times)
INSERT INTO businesses (
  name, slug, description, greeting, ai_instructions, products,
  country, plan, is_active, chat_accent,
  whatsapp_connected, instagram_connected, facebook_connected, tiktok_connected
) VALUES (
  'Orda Demo',
  'orda-demo',
  'A world-class retail experience powered by Orda AI. Browse our collection and place orders instantly.',
  'Welcome. I am your personal shopping assistant. What can I help you find today?',
  'You are a premium retail assistant. Help customers discover products, answer questions with confidence, take orders professionally, and provide exceptional service. Always upsell naturally. Never mention you are an AI unless directly asked.',
  '[
    {"name":"Midnight Bomber Jacket","price":189,"description":"Premium heavyweight bomber in midnight black"},
    {"name":"Phantom Hoodie","price":95,"description":"Oversized drop-shoulder hoodie in washed grey"},
    {"name":"Carbon Cargo Pants","price":125,"description":"Technical cargo pants with zipper pockets"},
    {"name":"Obsidian Cap","price":45,"description":"Structured 6-panel cap with embroidered logo"}
  ]'::jsonb,
  'Global', 'trial', true, '#8729A0',
  false, false, false, false
) ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  description      = EXCLUDED.description,
  greeting         = EXCLUDED.greeting,
  ai_instructions  = EXCLUDED.ai_instructions,
  products         = EXCLUDED.products,
  chat_accent      = EXCLUDED.chat_accent,
  is_active        = EXCLUDED.is_active;

-- STEP 9: Verify
SELECT 'chat_sessions exists:' AS check, COUNT(*) FROM chat_sessions;
SELECT 'chat_messages exists:' AS check, COUNT(*) FROM chat_messages;
SELECT 'orda-demo slug:' AS check, slug, name, plan FROM businesses WHERE slug = 'orda-demo';
SELECT 'businesses.slug column:' AS check, column_name FROM information_schema.columns
  WHERE table_name = 'businesses' AND column_name = 'slug';
