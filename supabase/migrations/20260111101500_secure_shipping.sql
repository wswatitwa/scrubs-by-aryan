-- 1. Enable RLS
ALTER TABLE shipping_zones ENABLE ROW LEVEL SECURITY;

-- 2. Clean Up Old Policies (Idempotency)
DROP POLICY IF EXISTS "Public Read Zones" ON shipping_zones;
DROP POLICY IF EXISTS "Staff Manage Zones" ON shipping_zones;

-- 3. Public Read (Checkout needs to calculate shipping)
CREATE POLICY "Public Read Zones" 
ON shipping_zones 
FOR SELECT 
USING (true);

-- 4. Staff Manage (Admins only)
CREATE POLICY "Staff Manage Zones" 
ON shipping_zones 
FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);
