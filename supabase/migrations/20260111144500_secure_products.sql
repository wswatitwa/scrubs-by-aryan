-- Secure Products Table
-- Steps:
-- 1. Enable RLS
-- 2. Allow Public Read (Anon + Authenticated)
-- 3. Allow Authenticated (Staff) to Manage (Insert/Update/Delete)

-- 1. Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to ensure clean slate
DROP POLICY IF EXISTS "Public Read Products" ON products;
DROP POLICY IF EXISTS "Staff Manage Products" ON products;

-- 3. Create "Public Read" Policy
-- Allows anyone (including anonymous users) to read products.
-- We can optionally filter by 'is_featured' or stock if needed, but for now allow all visible.
CREATE POLICY "Public Read Products"
ON products FOR SELECT
USING (true);

-- 4. Create "Staff Manage" Policy
-- Allows logged-in staff to Insert, Update, Delete products.
CREATE POLICY "Staff Manage Products"
ON products FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
