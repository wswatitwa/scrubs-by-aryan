-- Fix "RLS Policy Always True" for Categories
-- Replace "USING (true)" with specific "is_staff()" check

-- 1. Drop the permissive policy
DROP POLICY IF EXISTS "Staff Manage Categories" ON categories;

-- 2. Create the strict policy
CREATE POLICY "Staff Manage Categories" ON categories
FOR ALL 
TO authenticated
USING (public.is_staff()) 
WITH CHECK (public.is_staff());
