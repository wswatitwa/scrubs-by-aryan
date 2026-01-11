# Task 011: Security Hardening (Reviews)

**Priority:** Critical
**Triggered By:** Supabase Security Advisory

## Objective
Enable Row Level Security (RLS) on the `reviews` table to prevent unauthorized modification or deletion of customer feedback.

## Current Vulnerability
The `public.reviews` table is wide open.
*   **Risk 1**: Malicious users could DELETE all negative reviews.
*   **Risk 2**: Spammers could UPDATE existing reviews to facilitate scams.
*   **Risk 3**: Users could forge `is_verified` status.

## Remediation Plan

### 1. Database Migration
Create `supabase/migrations/20260111083000_secure_reviews.sql`:
*   **Enable RLS**: `ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;`
*   **Policy: Public Read**: Everyone can read reviews.
*   **Policy: Controlled Insert**:
    *   Allow public inserts (since Guest Checkout exists).
    *   *Constraint*: Enforce `is_verified = false` for anonymous users (if possible via `WITH CHECK`) OR just allow it for now and fix in Task 010.
    *   *Decision*: For now, allow public insert to avoid breaking the current UI. We will tighten this in Task 010 (User Accounts).
*   **Policy: Admin Only Modify**:
    *   `UPDATE/DELETE` restricted to `authenticated` staff or `service_role`.

### 2. Implementation details (SQL)
```sql
-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 1. Everyone can read
CREATE POLICY "Public Read Reviews"
ON reviews FOR SELECT
USING (true);

-- 2. Everyone can submit (Guest Reviews)
CREATE POLICY "Public Submit Reviews"
ON reviews FOR INSERT
WITH CHECK (true);

-- 3. Only Staff can delete (Moderation)
CREATE POLICY "Staff Delete Reviews"
ON reviews FOR DELETE
USING (auth.role() = 'authenticated');
```

## Future Proofing (Note for Task 010)
Once User Accounts are active, we will update "Public Submit Reviews" to:
1.  Link `user_id` to the review.
2.  Only allow `is_verified = true` if the system (Trigger) sets it, not the user.

## Definition of Done
*   `reviews` table has RLS enabled.
*   Anonymous users can still see and post reviews.
*   Anonymous users CANNOT delete reviews (Verified by trying to delete via API).
