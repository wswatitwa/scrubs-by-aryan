# Task 017: Security Hardening (Store Settings)

**Priority:** High
**Trigger:** Supabase Advisory

## Objective
Enable Row Level Security (RLS) on the `store_settings` table.

## The Problem
`public.store_settings` is currently open.
*   **Risk**: Malicious actors could change the global `embroidery_fee` or other sensitive flags, causing financial loss or UI breakage.

## Remediation Plan (SQL)
Create `supabase/migrations/20260111103000_secure_settings.sql`:

1.  **Enable RLS**: `ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;`
2.  **Public Read**: `CREATE POLICY "Public Read Settings" ON store_settings FOR SELECT USING (true);`
    *   *Why?* The App needs to read `embroideryFee` to calculate totals for guests.
3.  **Admin Update**: `CREATE POLICY "Staff Update Settings" ON store_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);`
    *   *Note*: Only UPDATE is needed as this is a singleton row (ID=1). We typically don't insert/delete settings rows.

## Definition of Done
*   RLS enabled.
*   Guest users can still fetch settings.
*   Guest users CANNOT modify settings.
