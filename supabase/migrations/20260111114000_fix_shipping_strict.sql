-- Fix "RLS Policy Always True" for Shipping Zones
-- Replace "USING (true)" with specific "is_staff()" check

-- 1. Drop the permissive policy
DROP POLICY IF EXISTS "Staff Manage Zones" ON shipping_zones;

-- 2. Create the strict policy (using the is_staff helper)
CREATE POLICY "Staff Manage Zones" ON shipping_zones
FOR ALL 
TO authenticated
USING (public.is_staff()) 
WITH CHECK (public.is_staff());
