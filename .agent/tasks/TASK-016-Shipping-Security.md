# Task 016: Security Hardening (Shipping Zones)

**Priority:** High
**Trigger:** Supabase Advisory

## Objective
Enable Row Level Security (RLS) on the `shipping_zones` table. This is similar to the Reviews fix.

## The Problem
`public.shipping_zones` is currently open.
*   **Risk**: Malicious actors could delete zones or change fees to $0.00.

## Remediation Plan (SQL)
Create `supabase/migrations/20260111101500_secure_shipping.sql`:

1.  **Enable RLS**: `ALTER TABLE shipping_zones ENABLE ROW LEVEL SECURITY;`
2.  **Public Read**: `CREATE POLICY "Public Read Zones" ON shipping_zones FOR SELECT USING (true);`
    *   *Why?* Checkout page needs to fetch rates for Guest Users.
3.  **Admin Manage**: Create policies for INSERT/UPDATE/DELETE restricted to staff.
    *   `USING (auth.role() = 'authenticated')` (assuming all staff can edit zones, or check `staff_profiles` permissions if strict).
    *   *Decision*: For V1, `auth.role() = 'authenticated'` is sufficient as only Staff have logins.

## Definition of Done
*   `shipping_zones` RLS is ENABLED.
*   Guests can still calculate shipping at checkout.
*   Guests CANNOT edit shipping fees.
