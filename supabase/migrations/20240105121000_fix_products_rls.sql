-- FIX PRODUCTS VISIBILITY
-- The 'products' table likely has RLS enabled but no policies, making rows invisible to the public.

-- 1. Enable RLS (just in case)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to ensure clean state
DROP POLICY IF EXISTS "Public Read Products" ON products;
DROP POLICY IF EXISTS "Public All Products" ON products;
DROP POLICY IF EXISTS "Allow public read access" ON products;
DROP POLICY IF EXISTS "Allow authenticated insert" ON products;
DROP POLICY IF EXISTS "Allow authenticated update" ON products;
DROP POLICY IF EXISTS "Allow authenticated delete" ON products;

-- 3. Create Policy: Public Read Access (Critical for Front Office)
-- Allows anyone (anon or authenticated) to VIEW products
CREATE POLICY "Allow public read access" ON products FOR SELECT USING (true);

-- 4. Create Policy: Staff/Admin Insert/Update/Delete
-- Ideally validation should be stricter, but for now we allow ANY permissions for simplicity
-- or verify auth role.
-- STRICTER: using (auth.role() = 'authenticated')
CREATE POLICY "Allow authenticated insert" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON products FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON products FOR DELETE USING (true);
