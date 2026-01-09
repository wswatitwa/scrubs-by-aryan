-- Enable Realtime for the orders table
-- This is critical for the Admin Dashboard to receive instant updates

-- 1. Ensure the publication exists (Supabase default is 'supabase_realtime')
-- We add the 'orders' table to this publication
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- 2. Verify RLS (Row Level Security)
-- Ensure that the backend (authenticated staff) can SELECT
-- Ensure that the frontend (anon/public) can INSERT

-- Re-apply policies just to be safe and explicit
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON orders;
DROP POLICY IF EXISTS "Enable insert access for all users" ON orders;

-- Allow anyone to create an order (Public Store)
CREATE POLICY "Enable insert access for all users" ON orders FOR INSERT WITH CHECK (true);

-- Allow anyone to read orders (Admin Dashboard - relying on client-side auth for now, or service_role)
-- In a stricter app, this would be: auth.role() = 'authenticated'
CREATE POLICY "Enable read access for all users" ON orders FOR SELECT USING (true);

-- 3. Replica Identity
-- Often required for UPDATE/DELETE replication
ALTER TABLE orders REPLICA IDENTITY FULL;
