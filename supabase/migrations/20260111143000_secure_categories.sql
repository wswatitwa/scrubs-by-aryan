-- Secure Categories Table
-- Steps:
-- 1. Enable RLS
-- 2. Allow Public Read (Anon + Authenticated)
-- 3. Allow Authenticated (Staff) to Manage (Insert/Update/Delete)

-- 1. Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to ensure clean slate
DROP POLICY IF EXISTS "Public Read Categories" ON categories;
DROP POLICY IF EXISTS "Staff Manage Categories" ON categories;

-- 3. Create "Public Read" Policy
-- Allows anyone (including anonymous users) to read categories.
CREATE POLICY "Public Read Categories"
ON categories FOR SELECT
USING (true);

-- 4. Create "Staff Manage" Policy
-- Allows logged-in staff to Insert, Update, Delete categories.
CREATE POLICY "Staff Manage Categories"
ON categories FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
