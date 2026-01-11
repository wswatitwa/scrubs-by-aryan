# Task 018: Security Hardening (Tenders)

**Priority:** High
**Trigger:** Supabase Advisory

## Objective
Enable Row Level Security (RLS) on the `tenders` table.

## The Problem
`public.tenders` is currently open.
*   **Risk**: Competitors could technically query the API to see who else is submitting tenders (Corporate Espionage risk).

## Remediation Plan (SQL)
Create `supabase/migrations/20260111104500_secure_tenders.sql`:

1.  **Enable RLS**: `ALTER TABLE tenders ENABLE ROW LEVEL SECURITY;`
2.  **Public Submit**: `CREATE POLICY "Public Submit Tender" ON tenders FOR INSERT TO public WITH CHECK (true);`
    *   *Why?* Any guest can fill out the "Bulk / Tender Inquiry" form.
3.  **Staff Manage**: `CREATE POLICY "Staff Manage Tenders" ON tenders FOR ALL TO authenticated USING (true) WITH CHECK (true);`
    *   *Why?* Only logged-in Admins/Staff should see the list of incoming tenders.

## Definition of Done
*   RLS enabled on `tenders`.
*   Guests can Submit.
*   Guests CANNOT List/View entries.
*   Staff can View/Manage all.
