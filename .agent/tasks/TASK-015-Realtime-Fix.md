# Task 015: Realtime Replication Fix

**Priority:** Critical (Bug)
**Trigger:** User Report (Data Sync Failure)

## Objective
Ensure that `products`, `categories`, and `orders` tables actully broadcast changes to connected clients.

## The Issue
Users report that added items "don't reflect" in the Front Office.
This typically happens when the Database Table is **not** added to the `supabase_realtime` publication.
*   **Symptom**: Admin adds item (sees it due to Optimistic UI). Customer (listening on socket) hears silence.

## The Fix (Database)
Create `supabase/migrations/20260111100000_enable_realtime.sql`.

```sql
/**
 * REALTIME ENABLEMENT
 * Explicitly add core tables to the publication.
 */

-- 1. Enable Realtime for Products (Critical for Shop)
ALTER PUBLICATION supabase_realtime ADD TABLE products;

-- 2. Enable Realtime for Categories (Critical for Nav)
ALTER PUBLICATION supabase_realtime ADD TABLE categories;

-- 3. Enable Realtime for Orders (Critical for Admin Dashboard)
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- 4. Set Replica Identity (Ensures UPDATE events contain old data for correct state merging)
ALTER TABLE products REPLICA IDENTITY FULL;
ALTER TABLE categories REPLICA IDENTITY FULL;
ALTER TABLE orders REPLICA IDENTITY FULL;
```

## Verification
1.  Open Store in Browser A (Front Office).
2.  Open Admin in Browser B (Back Office).
3.  Add product in B.
4.  **Verify**: Browser A should show the new product card *instantly* without refresh.

## Action
Run this migration immediately in the Supabase Dashboard SQL Editor.
