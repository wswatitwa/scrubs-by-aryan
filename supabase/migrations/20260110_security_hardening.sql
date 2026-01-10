-- Migration: 20260110_security_hardening.sql
-- Description: Task 1.1 - Database Security Hardening
-- Author: Antigravity

-- =============================================================================
-- 1. Enable Row Level Security (RLS) on ALL Critical Tables
-- =============================================================================
ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS tenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS staff ENABLE ROW LEVEL SECURITY; -- If exists

-- =============================================================================
-- 2. Cleanup Insecure Policies (Drop All to Start Fresh)
-- =============================================================================
DO $$ 
DECLARE 
    tbl text; 
BEGIN 
    FOR tbl IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Enable access to all users" ON %I', tbl);
        EXECUTE format('DROP POLICY IF EXISTS "Public read access" ON %I', tbl);
        EXECUTE format('DROP POLICY IF EXISTS "Public CRUD" ON %I', tbl);
        EXECUTE format('DROP POLICY IF EXISTS "Anon Read" ON %I', tbl);
        EXECUTE format('DROP POLICY IF EXISTS "Anon Write" ON %I', tbl);
    END LOOP; 
END $$;

-- =============================================================================
-- 3. Staff Profiles (RBAC Foundation)
-- =============================================================================
-- Use 'staff_profiles' to avoid conflict if 'staff' table exists but is not linked to auth
CREATE TABLE IF NOT EXISTS public.staff_profiles (
    id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    role TEXT DEFAULT 'staff',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id)
);
ALTER TABLE public.staff_profiles ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 4. Define Strict Access Policies
-- =============================================================================

-- --- PRODUCTS ---
-- Public: Read Only
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);
-- Staff: Full Management
CREATE POLICY "Staff Manage Products" ON products FOR ALL 
USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- --- CATEGORIES ---
-- Public: Read Only
CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);
-- Staff: Full Management
CREATE POLICY "Staff Manage Categories" ON categories FOR ALL 
USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- --- ORDERS ---
-- Public: Insert Only (Place Order)
CREATE POLICY "Public Create Orders" ON orders FOR INSERT WITH CHECK (true);
-- Staff: Read & Update (Process Orders)
CREATE POLICY "Staff Read Orders" ON orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Staff Update Orders" ON orders FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Staff Delete Orders" ON orders FOR DELETE USING (auth.role() = 'authenticated');

-- --- TENDERS ---
-- Public: Insert Only (Submit Tender)
CREATE POLICY "Public Create Tenders" ON tenders FOR INSERT WITH CHECK (true);
-- Staff: Read & Manage
CREATE POLICY "Staff Manage Tenders" ON tenders FOR ALL 
USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- --- REVIEWS ---
-- Public: Read All
CREATE POLICY "Public Read Reviews" ON reviews FOR SELECT USING (true);
-- Public: Insert (Add Review)
CREATE POLICY "Public Create Reviews" ON reviews FOR INSERT WITH CHECK (true);
-- Staff: Manage (Delete inappropriate)
CREATE POLICY "Staff Manage Reviews" ON reviews FOR ALL 
USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- --- SHIPPING ZONES ---
-- Public: Read Only (Calculate fees)
CREATE POLICY "Public Read ShippingZones" ON shipping_zones FOR SELECT USING (true);
-- Staff: Manage
CREATE POLICY "Staff Manage ShippingZones" ON shipping_zones FOR ALL 
USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- --- SOCIAL LINKS ---
-- Public: Read Only
CREATE POLICY "Public Read SocialLinks" ON social_links FOR SELECT USING (true);
-- Staff: Manage
CREATE POLICY "Staff Manage SocialLinks" ON social_links FOR ALL 
USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- --- STORE SETTINGS ---
-- Public: Read Only
CREATE POLICY "Public Read Settings" ON store_settings FOR SELECT USING (true);
-- Staff: Manage
CREATE POLICY "Staff Manage Settings" ON store_settings FOR ALL 
USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- --- STAFF I PROFILES ---
CREATE POLICY "Read Own Profile" ON staff_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Update Own Profile" ON staff_profiles FOR UPDATE USING (auth.uid() = id);


-- =============================================================================
-- 5. Data Integrity & Constraints
-- =============================================================================

-- Categories Name Uniqueness (Required for FK)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'categories_name_key') THEN
        ALTER TABLE categories ADD CONSTRAINT categories_name_key UNIQUE (name);
    END IF;
END $$;

-- Products -> Categories FK
ALTER TABLE products DROP CONSTRAINT IF EXISTS fk_products_category;
ALTER TABLE products 
ADD CONSTRAINT fk_products_category 
FOREIGN KEY (category) 
REFERENCES categories(name) 
ON UPDATE CASCADE;
