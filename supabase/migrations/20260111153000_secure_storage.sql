-- Secure Storage (Product Images)
-- Fix: Removed 'ALTER TABLE' which causes ownership errors. Storage RLS is enabled by default.

-- 1. Ensure Bucket Exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Drop existing policies to ensure clean state
DROP POLICY IF EXISTS "Public Access Product Images" ON storage.objects;
DROP POLICY IF EXISTS "Staff Upload Product Images" ON storage.objects;
DROP POLICY IF EXISTS "Staff Update Product Images" ON storage.objects;
DROP POLICY IF EXISTS "Staff Delete Product Images" ON storage.objects;

-- 3. Create Policies

-- Policy: Public Read
CREATE POLICY "Public Access Product Images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

-- Policy: Staff Upload (Insert)
CREATE POLICY "Staff Upload Product Images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'product-images' );

-- Policy: Staff Update
CREATE POLICY "Staff Update Product Images"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'product-images' );

-- Policy: Staff Delete
CREATE POLICY "Staff Delete Product Images"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'product-images' );
