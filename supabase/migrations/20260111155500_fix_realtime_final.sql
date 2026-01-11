-- Final Realtime Fix
-- This script safely ensures correct configuration without erroring if already set.

-- 1. Force Replica Identity to FULL (Safe to run multiple times)
ALTER TABLE products REPLICA IDENTITY FULL;

-- 2. Grant permissions just in case (Idempotent-ish)
GRANT SELECT ON products TO anon;
GRANT SELECT ON products TO authenticated;

-- 3. Safely add to publication
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'products'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE products;
    END IF;
END $$;
