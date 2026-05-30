-- push_subscriptions table
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT true
);
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='push_subscriptions' AND policyname='owner_manages_push') THEN
    EXECUTE 'CREATE POLICY "owner_manages_push" ON push_subscriptions USING (user_id = auth.uid())';
  END IF;
END $$;

-- Notification settings on businesses
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS notification_phone TEXT,
  ADD COLUMN IF NOT EXISTS notify_whatsapp BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_push BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_sound BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_daily_summary BOOLEAN DEFAULT true;

-- SECURITY DEFINER RPCs (bypass RLS safely for server-side calls)
CREATE OR REPLACE FUNCTION get_push_subscriptions(p_business_id UUID)
RETURNS TABLE(endpoint TEXT, p256dh TEXT, auth TEXT)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY SELECT ps.endpoint, ps.p256dh, ps.auth
  FROM push_subscriptions ps
  WHERE ps.business_id = p_business_id AND ps.is_active = true;
END;$$;

CREATE OR REPLACE FUNCTION get_business_notify_settings(p_id UUID)
RETURNS TABLE(whatsapp_phone TEXT, notification_phone TEXT, notify_whatsapp BOOLEAN, notify_daily_summary BOOLEAN, name TEXT, currency TEXT)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY SELECT b.whatsapp_phone, b.notification_phone, b.notify_whatsapp,
    b.notify_daily_summary, b.name, b.currency
  FROM businesses b WHERE b.id = p_id;
END;$$;

CREATE OR REPLACE FUNCTION get_business_daily_stats(p_business_id UUID, p_from TIMESTAMPTZ, p_to TIMESTAMPTZ)
RETURNS TABLE(total_orders BIGINT, total_revenue NUMERIC, total_messages BIGINT)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY SELECT
    COALESCE((SELECT COUNT(*) FROM orders o WHERE o.business_id=p_business_id AND o.created_at>=p_from AND o.created_at<p_to),0)::BIGINT,
    COALESCE((SELECT SUM(o.total) FROM orders o WHERE o.business_id=p_business_id AND o.created_at>=p_from AND o.created_at<p_to),0)::NUMERIC,
    COALESCE((SELECT COUNT(*) FROM messages m WHERE m.business_id=p_business_id AND m.is_ai=false AND m.created_at>=p_from AND m.created_at<p_to),0)::BIGINT;
END;$$;

CREATE OR REPLACE FUNCTION get_businesses_for_summary()
RETURNS TABLE(id UUID, name TEXT, currency TEXT)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY SELECT b.id, b.name, b.currency
  FROM businesses b WHERE b.whatsapp_connected=true AND b.notify_daily_summary=true;
END;$$;

CREATE OR REPLACE FUNCTION deactivate_push_endpoint(p_endpoint TEXT)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE push_subscriptions SET is_active=false WHERE endpoint=p_endpoint;
END;$$;

GRANT EXECUTE ON FUNCTION get_push_subscriptions TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_business_notify_settings TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_business_daily_stats TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_businesses_for_summary TO anon, authenticated;
GRANT EXECUTE ON FUNCTION deactivate_push_endpoint TO anon, authenticated;
