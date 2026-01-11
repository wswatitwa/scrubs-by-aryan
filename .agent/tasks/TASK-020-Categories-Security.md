# Task 020: Security Hardening (Categories)

**Priority:** Critical
**Trigger:** Supabase Advisory ("RLS Policy Always True")

## The Issue
The `categories` table has a policy named "Allow public delete" (or similar default) that allows `DELETE FROM categories USING (true)`.
*   **Risk**: Any anonymous user could wipe your entire product catalog structure.

## Remediation Plan (SQL)
Create `supabase/migrations/20260111111500_fix_categories_rls.sql`:

1.  **Revoke**: Drop the insecure "Allow public delete" policy.
2.  **Strict Access**: Re-define policies so only `authenticated` (Staff) can Insert/Update/Delete.
3.  **Public Access**: Ensure `Select` remains open for the store to function.

## Definition of Done
*   Advisory cleared.
*   Anonymous users CANNOT delete categories.
*   Staff CAN manage categories.
*   Storefront still loads categories.
