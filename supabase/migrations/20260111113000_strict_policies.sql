/**
 * STRICT POLICIES
 * Replaces permissive checks with specific logic to satisfy Linter & Security.
 */

-- 1. UTILITY: Check if user is a valid Staff Member
CREATE OR REPLACE FUNCTION is_staff() 
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (SELECT 1 FROM staff_profiles WHERE id = auth.uid());
$$;

-- 2. CATEGORIES
DROP POLICY IF EXISTS "Staff Manage Categories" ON categories;
DROP POLICY IF EXISTS "Allow public insert" ON categories;
DROP POLICY IF EXISTS "Allow public update" ON categories;

CREATE POLICY "Staff Manage Categories" ON categories
FOR ALL TO authenticated
USING (is_staff())
WITH CHECK (is_staff());

-- 3. PRODUCTS
DROP POLICY IF EXISTS "Allow authenticated delete" ON products;
DROP POLICY IF EXISTS "Allow authenticated insert" ON products;
DROP POLICY IF EXISTS "Allow authenticated update" ON products;

CREATE POLICY "Staff Manage Products" ON products
FOR ALL TO authenticated
USING (is_staff())
WITH CHECK (is_staff());

-- 4. ORDERS
DROP POLICY IF EXISTS "Enable insert access for all users" ON orders;

CREATE POLICY "Public Create Orders" ON orders
FOR INSERT TO public
WITH CHECK (
  status = 'Pending' -- Guests cannot create 'Paid' orders directly
);

-- 5. REVIEWS
DROP POLICY IF EXISTS "Public Submit Reviews" ON reviews;

CREATE POLICY "Public Submit Reviews" ON reviews
FOR INSERT TO public
WITH CHECK (
  rating >= 1 AND rating <= 5 -- Data Validation constraint
);

-- 6. TENDERS
DROP POLICY IF EXISTS "Public Submit Tenders" ON tenders; 

CREATE POLICY "Public Submit Tenders" ON tenders
FOR INSERT TO public
WITH CHECK (
  char_length(org_name) > 0 -- Basic validation
);
