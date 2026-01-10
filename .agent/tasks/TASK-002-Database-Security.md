# Task 002: Database Security Hardening

**Priority:** Critical
**Status:** Ready to Apply

## Objective
Secure the `products` table and enforce data integrity between Products and Categories.

## Context
We currently have a `products` table with open RLS policies (`WITH CHECK (true)`). This is a security vulnerability. We also lack Foreign Key constraints.

## Resources
*   Migration File: `supabase/migrations/20260110195000_security_hardening.sql`

## Action Plan
1.  **Review the SQL**: The migration text is already generated.
2.  **Apply Migration**:
    *   **Option A (Supabase Dashboard)**: Copy the content of the SQL file and run it in the SQL Editor of the Supabase Project Dashboard.
    *   **Option B (CLI)**: If CLI is available (unlikely in this env), run `supabase db push`.
3.  **Verify**:
    *   Try to delete a product via the App (Storefront) while logged out. It should FAIL (checking RLS).
    *   Try to rename a Category. It should succeed.
    *   Check if Products under that Category updated their `category` column automatically (Cascade check).

## Definition of Done
*   `products` table RLS is enabled and policies are strict.
*   Foreign Key `fk_products_category` exists.
