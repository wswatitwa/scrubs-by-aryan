-- COMPREHENSIVE REPAIR SCRIPT
-- Run this entire script in the Supabase SQL Editor to fix missing tables and enable Realtime.

-- 1. Create Tables (Safe if they already exist)
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
    colors JSONB,
    sizes JSONB,
    styles JSONB,
    materials JSONB,
    includes JSONB,
    package_size TEXT,
    model TEXT,
    warranty TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_verified BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    location TEXT NOT NULL,
    subtotal NUMERIC NOT NULL,
    shipping_fee NUMERIC NOT NULL,
    total NUMERIC NOT NULL,
    status TEXT NOT NULL,
    mpesa_code TEXT,
    shipping_method TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    items JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS shipping_zones (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    fee NUMERIC NOT NULL,
    estimated_days TEXT NOT NULL
);

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

CREATE TABLE IF NOT EXISTS store_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    embroidery_fee NUMERIC DEFAULT 300,
    CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO store_settings (id, embroidery_fee) VALUES (1, 300) ON CONFLICT (id) DO NOTHING;

-- 2. Enable Realtime
-- This fixes the issue where orders don't appear instantly
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER TABLE orders REPLICA IDENTITY FULL;

-- 3. Fix Permissions (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop old policies to ensure clean state
DROP POLICY IF EXISTS "Enable read access for all users" ON orders;
DROP POLICY IF EXISTS "Enable insert access for all users" ON orders;
DROP POLICY IF EXISTS "Public Insert Orders" ON orders;
DROP POLICY IF EXISTS "Public Read Orders" ON orders;

-- Create correct policies
CREATE POLICY "Enable insert access for all users" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read access for all users" ON orders FOR SELECT USING (true);
