-- Add sub_category to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS sub_category TEXT;

-- Verify it exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' AND column_name = 'sub_category';
