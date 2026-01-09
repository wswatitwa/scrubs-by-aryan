-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    path TEXT NOT NULL,
    sub_categories TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read access" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON categories FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete" ON categories FOR DELETE USING (auth.role() = 'authenticated');

-- Seed Initial Data
INSERT INTO categories (name, path, sub_categories) VALUES
('Apparel', '/apparel', ARRAY['Scrubs', 'Lab Coats', 'Underscrubs', 'Printed Scrubs']),
('Footwear', '/footwear', ARRAY['Medical Clogs', 'Performance Sneakers', 'Compression Wear', 'Theater Shoes']),
('PPE', '/ppe', ARRAY['Protective Footwear', 'Headgear', 'Respiratory', 'Hand Protection', 'Body Wear', 'Eye Protection']),
('Equipment', '/equipment', ARRAY['Stethoscopes', 'BP Machines', 'Monitor Systems', 'ENT & General']),
('Diagnostics', '/diagnostics', ARRAY['Glucometers', 'Rapid Test Kits', 'Lab Consumables']),
('Accessories', '/accessories', ARRAY['Watches', 'Organization', 'Utility'])
ON CONFLICT (name) DO UPDATE SET sub_categories = EXCLUDED.sub_categories;
