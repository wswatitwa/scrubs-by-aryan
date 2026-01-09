-- ==========================================
-- SUPER ADMIN REPAIR SCRIPT
-- ==========================================

-- 1. Reset RLS Policies (Fixes "Permission Denied")
DROP POLICY IF EXISTS "Admins can view all profiles" ON staff_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON staff_profiles;
DROP POLICY IF EXISTS "Admins can manage profiles" ON staff_profiles;

CREATE POLICY "Users can view own profile" 
    ON staff_profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
    ON staff_profiles FOR SELECT 
    USING (
      auth.uid() IN (SELECT id FROM staff_profiles WHERE role = 'admin')
    );

CREATE POLICY "Admins can manage profiles" 
    ON staff_profiles FOR ALL 
    USING (
      auth.uid() IN (SELECT id FROM staff_profiles WHERE role = 'admin')
    );

-- 2. Force Sync Profile ID (Fixes match by ID directly)
DELETE FROM public.staff_profiles WHERE id = 'aff7dd06-1c94-481a-853d-f8c2e6c390e3';

-- We insert a fresh profile using the EXACT ID
INSERT INTO public.staff_profiles (id, name, email, role, permissions)
VALUES (
  'aff7dd06-1c94-481a-853d-f8c2e6c390e3',
  'Super Admin',
  'wwatitwa@gmail.com', -- This is for display, auth uses the ID
  'admin',
  '{"access_orders": true, "access_inventory": true, "access_revenue_data": true}'
);

-- 3. Verify Result
SELECT * FROM public.staff_profiles WHERE id = 'aff7dd06-1c94-481a-853d-f8c2e6c390e3';
