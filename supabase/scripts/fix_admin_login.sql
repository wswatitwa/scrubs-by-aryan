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

-- 2. Force Sync Profile ID (Fixes "Profile not linked" / ID Mismatch)
-- We delete any existing profile for this email to clear bad IDs
DELETE FROM public.staff_profiles WHERE email = 'wwatitwa@gmail.com';

-- We insert a fresh profile using the EXACT ID from `auth.users`
INSERT INTO public.staff_profiles (id, name, email, role, permissions)
SELECT 
  id, 
  'Super Admin', 
  email, 
  'admin', 
  '{"access_orders": true, "access_inventory": true, "access_revenue_data": true}'
FROM auth.users 
WHERE email = 'wwatitwa@gmail.com';

-- 3. Verify Result
SELECT * FROM public.staff_profiles WHERE email = 'wwatitwa@gmail.com';
