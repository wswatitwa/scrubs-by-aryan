-- Migration: Security Hardening & Data Integrity
-- Date: 2026-01-10
-- Author: Sovereign CTO

-- 1. Secure the 'products' table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop insecure policies if they exist (clean slate)
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Enable insert for all users" ON products;
DROP POLICY IF EXISTS "Enable update for all users" ON products;
DROP POLICY IF EXISTS "Enable delete for all users" ON products;
DROP POLICY IF EXISTS "Allow public read-write" ON products;

-- Create strict policies
-- Public Read
CREATE POLICY "Enable public read access" 
ON products FOR SELECT 
TO public, anon, authenticated 
USING (true);

-- Authenticated (Staff) Write
CREATE POLICY "Enable admin write access" 
ON products FOR INSERT 
TO authenticated 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable admin update access" 
ON products FOR UPDATE 
TO authenticated 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable admin delete access" 
ON products FOR DELETE 
TO authenticated 
USING (auth.role() = 'authenticated');

-- 2. Data Integrity: Link Products to Categories
-- This ensures that if a Category is renamed, all its products update automatically.
-- It also prevents deleting a Category if it still has products (unless CASCADE is added to delete, but we usually want to restrict).

-- First, ensure categories.name is Unique (it should be, but let's enforce)
ALTER TABLE categories ADD CONSTRAINT categories_name_key UNIQUE (name);

-- Add the Foreign Key
BEGIN;
  -- Optional: Clean up orphans before adding constraint? 
  -- For now, we assume data is clean or we want this to fail if dirty so we can fix it.
  ALTER TABLE products 
  ADD CONSTRAINT fk_products_category 
  FOREIGN KEY (category) 
  REFERENCES categories(name) 
  ON UPDATE CASCADE
  ON DELETE RESTRICT; -- Prevent accidental category deletion if products exist
COMMIT;
