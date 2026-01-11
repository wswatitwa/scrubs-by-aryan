-- Fix RLS vulnerability on Categories

-- 1. Drop ALL potentially conflicting policies first to ensure clean state
DROP POLICY IF EXISTS "Allow public delete" ON categories;
DROP POLICY IF EXISTS "Enable delete for all users" ON categories;
DROP POLICY IF EXISTS "Enable insert for all users" ON categories;
DROP POLICY IF EXISTS "Enable update for all users" ON categories;
DROP POLICY IF EXISTS "Public Read Categories" ON categories;
DROP POLICY IF EXISTS "Enable read access for all users" ON categories;
DROP POLICY IF EXISTS "Staff Manage Categories" ON categories;

-- 2. Ensure RLS is enabled (idempotent)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 3. Public Read Access (Crucial for Storefront)
CREATE POLICY "Public Read Categories"
ON categories
FOR SELECT
TO public
USING (true);

-- 4. Staff Management Access (Authenticated Only)
CREATE POLICY "Staff Manage Categories"
ON categories
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
