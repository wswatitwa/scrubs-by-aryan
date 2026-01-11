# Task 021: Strict Policy Refinement (Linter Fixes)

**Priority:** Medium (Compliance & Hardening)
**Trigger:** Supabase Dashboard 10 Warnings
**Goal:** Replace "Always True" policies with "Logic-Based" policies to satisfy the security linter and tighten control.

## The Strategy
The linter flags `USING (true)` because it implies "Zero Filtering". Even for Admins, it's safer to check *something* (like existence in the profiles table). For Guests, we should enforce data integrity constraints.

## Remediation Plan (SQL)
Create `supabase/migrations/20260111113000_strict_policies.sql`:

```sql
/**
 * STRICT POLICIES
 * Replaces permissive checks with specific logic.
 */

-- 1. UTILITY: Check if user is a valid Staff Member
-- (This effectively locks out token-stealers who aren't in the staff table)
CREATE OR REPLACE FUNCTION is_staff() 
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (SELECT 1 FROM staff_profiles WHERE id = auth.uid());
$$;

-- 2. CATEGORIES (Fixing Warnings 1, 2, 3)
-- Drop old/permissive policies first
DROP POLICY IF EXISTS "Staff Manage Categories" ON categories;
DROP POLICY IF EXISTS "Allow public insert" ON categories;
DROP POLICY IF EXISTS "Allow public update" ON categories;

-- New Strict Admin Policy
CREATE POLICY "Staff Manage Categories" ON categories
FOR ALL TO authenticated
USING (is_staff())
WITH CHECK (is_staff());

-- 3. PRODUCTS (Fixing Warnings 5, 6, 7)
DROP POLICY IF EXISTS "Allow authenticated delete" ON products;
DROP POLICY IF EXISTS "Allow authenticated insert" ON products;
DROP POLICY IF EXISTS "Allow authenticated update" ON products;

CREATE POLICY "Staff Manage Products" ON products
FOR ALL TO authenticated
USING (is_staff())
WITH CHECK (is_staff());

-- 4. ORDERS (Fixing Warning 4)
DROP POLICY IF EXISTS "Enable insert access for all users" ON orders;

CREATE POLICY "Public Create Orders" ON orders
FOR INSERT TO public
WITH CHECK (
  status = 'Pending' -- Guests cannot create 'Paid' orders directly
);

-- 5. REVIEWS (Fixing Warning 8)
DROP POLICY IF EXISTS "Public Submit Reviews" ON reviews;

CREATE POLICY "Public Submit Reviews" ON reviews
FOR INSERT TO public
WITH CHECK (
  rating >= 1 AND rating <= 5 -- Data Validation constraint
);

-- 6. TENDERS (Fixing Warning 9)
DROP POLICY IF EXISTS "Public Submit Tenders" ON tenders; 
-- Note: Check if the policy name matches your DB exactly.

CREATE POLICY "Public Submit Tenders" ON tenders
FOR INSERT TO public
WITH CHECK (
  char_length(org_name) > 0 -- Basic validation
);
```

## Dashboard Action (Fixing Warning 10)
*   **Manual**: Go to Supabase Dashboard -> Authentication -> Configuration -> Security.
*   **Action**: Enable "Enable Leaked Password Protection" (HaveIBeenPwned).

## Definition of Done
*   All 10 Warnings cleared from Dashboard.
*   Functionality remains identical (Staff can edit, Guests can purchase).
