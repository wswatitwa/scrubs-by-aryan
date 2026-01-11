/**
 * OMNIBUS STRICT POLICY FIX (IDEMPOTENT VERSION)
 * Replaces ALL permissive 'USING (true)' policies with 'is_staff()' logic.
 * Checks for existence before creation to avoid errors.
 */

-- 1. SHIPPING ZONES
DROP POLICY IF EXISTS "Staff Manage Zones" ON shipping_zones;
CREATE POLICY "Staff Manage Zones" ON shipping_zones
FOR ALL TO authenticated
USING (public.is_staff()) 
WITH CHECK (public.is_staff());

-- 2. STORE SETTINGS
DROP POLICY IF EXISTS "Staff Update Settings" ON store_settings;
CREATE POLICY "Staff Update Settings" ON store_settings
FOR UPDATE TO authenticated
USING (public.is_staff()) 
WITH CHECK (public.is_staff());

-- 3. TENDERS
DROP POLICY IF EXISTS "Staff Manage Tenders" ON tenders;
CREATE POLICY "Staff Manage Tenders" ON tenders
FOR ALL TO authenticated
USING (public.is_staff()) 
WITH CHECK (public.is_staff());

-- 4. REVIEWS (Moderation)
DROP POLICY IF EXISTS "Staff Manage Reviews" ON reviews;
DROP POLICY IF EXISTS "Staff Update Reviews" ON reviews; -- Dropping explicitly to avoid 42710
DROP POLICY IF EXISTS "Staff Delete Reviews" ON reviews; -- Just in case naming varied

CREATE POLICY "Staff Manage Reviews" ON reviews
FOR DELETE TO authenticated
USING (public.is_staff());

CREATE POLICY "Staff Update Reviews" ON reviews
FOR UPDATE TO authenticated
USING (public.is_staff())
WITH CHECK (public.is_staff());

-- 5. ORDERS (Admin View)
DROP POLICY IF EXISTS "Staff Manage Orders" ON orders;
CREATE POLICY "Staff Manage Orders" ON orders
FOR ALL TO authenticated
USING (public.is_staff())
WITH CHECK (public.is_staff());
