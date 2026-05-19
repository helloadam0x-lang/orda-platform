-- Chat engine tables
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS products JSONB DEFAULT '[]';
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS greeting TEXT DEFAULT 'Hello! How can I help you today?';
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS ai_instructions TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS chat_accent TEXT DEFAULT '#8729A0';

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

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  is_ai BOOLEAN DEFAULT FALSE
);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

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

CREATE INDEX IF NOT EXISTS chat_sessions_business_id_idx ON chat_sessions(business_id);
CREATE INDEX IF NOT EXISTS chat_messages_session_id_idx ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS businesses_slug_idx ON businesses(slug);
