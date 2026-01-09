-- Enable UUID extension just in case, though we are using text IDs for legacy compatibility
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Products Table
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    sub_category TEXT,
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    description TEXT,
    image TEXT,
    is_featured BOOLEAN DEFAULT false,
    stock INTEGER DEFAULT 0,
    embroidery_price NUMERIC,
    colors JSONB, -- Array of {name, hex}
    sizes JSONB, -- Array of strings
    styles JSONB, -- Array of strings
    materials JSONB, -- Array of strings
    includes JSONB, -- Array of strings
    package_size TEXT,
    model TEXT,
    warranty TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Reviews Table (Linked to Products)
CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_verified BOOLEAN DEFAULT false
);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    location TEXT NOT NULL,
    subtotal NUMERIC NOT NULL,
    shipping_fee NUMERIC NOT NULL,
    total NUMERIC NOT NULL,
    status TEXT NOT NULL, -- 'Pending', 'Paid', 'Dispatched', etc.
    mpesa_code TEXT,
    shipping_method TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    items JSONB NOT NULL -- Stores the snapshot of CartItem[]
);

-- 4. Shipping Zones Table
CREATE TABLE IF NOT EXISTS shipping_zones (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    fee NUMERIC NOT NULL,
    estimated_days TEXT NOT NULL
);

-- 5. Tenders Table
CREATE TABLE IF NOT EXISTS tenders (
    id TEXT PRIMARY KEY,
    org_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    product_category TEXT NOT NULL,
    estimated_quantity INTEGER NOT NULL,
    requirements TEXT,
    status TEXT DEFAULT 'New',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Staff Profiles (Linked to Supabase Auth)
-- We replace the old simple 'staff' table with one linked to auth.users
CREATE TABLE IF NOT EXISTS staff_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'staff', -- 'admin' or 'staff'
    permissions JSONB DEFAULT '{"access_orders": true, "access_inventory": false, "access_revenue_data": false}',
    phone_number TEXT,
    last_active TIMESTAMP WITH TIME ZONE
);

-- RLS for Staff Profiles
ALTER TABLE staff_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Admins can view all profiles" ON staff_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON staff_profiles;
DROP POLICY IF EXISTS "Admins can manage profiles" ON staff_profiles;

-- Policy: Users can strictly view ONLY their own profile
CREATE POLICY "Users can view own profile" 
    ON staff_profiles FOR SELECT 
    USING (auth.uid() = id);

-- Policy: Admins can view ALL profiles
CREATE POLICY "Admins can view all profiles" 
    ON staff_profiles FOR SELECT 
    USING (
      auth.uid() IN (SELECT id FROM staff_profiles WHERE role = 'admin')
    );

-- Policy: Admins can INSERT/UPDATE/DELETE profiles
CREATE POLICY "Admins can manage profiles" 
    ON staff_profiles FOR ALL 
    USING (
      auth.uid() IN (SELECT id FROM staff_profiles WHERE role = 'admin')
    );

-- Trigger to create profile on signup? 
-- Ideally for staff, an Admin invites them, creating the auth user and the profile.
-- We will handle this via Supabase Edge Functions or simple client-side logic for now (less secure but fits current scope).


-- 7. Store Settings Table (Singleton)
CREATE TABLE IF NOT EXISTS store_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    embroidery_fee NUMERIC DEFAULT 300,
    CONSTRAINT single_row CHECK (id = 1)
);

-- Insert Default Store Settings
INSERT INTO store_settings (id, embroidery_fee)
VALUES (1, 300)
ON CONFLICT (id) DO NOTHING;

-- RLS POLICIES (Optional: For now, we assume service role or public access for simplicity, 
-- but in production you should enable RLS and use Supabase Auth)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for demo purposes)
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);
CREATE POLICY "Public Read Reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public Read Zones" ON shipping_zones FOR SELECT USING (true);
CREATE POLICY "Public Read Settings" ON store_settings FOR SELECT USING (true);

-- Allow authenticated/anon insert for orders (customers)
CREATE POLICY "Public Insert Orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Orders" ON orders FOR SELECT USING (true); -- CAUTION: Unsecure, for demo only
CREATE POLICY "Public Update Orders" ON orders FOR UPDATE USING (true);

-- Allow basic access for other tables for now
CREATE POLICY "Public All Tenders" ON tenders FOR ALL USING (true);
CREATE POLICY "Public All Staff" ON staff FOR ALL USING (true);
CREATE POLICY "Public All Products" ON products FOR ALL USING (true);
CREATE POLICY "Public All Settings" ON store_settings FOR ALL USING (true);
