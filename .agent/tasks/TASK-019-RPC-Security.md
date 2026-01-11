# Task 019: Security Hardening (RPC Search Path)

**Priority:** High
**Trigger:** Supabase Link Advisory
**Component:** Atomic Checkout RPC

## The Issue
The function `public.create_order_transaction` is defined as `SECURITY DEFINER` (runs as admin) but does not have a fixed `search_path`.
*   **Risk**: A malicious user could potentially trick the function into using a different `orders` or `products` table if they could manipulate the `search_path` (less likely in this setup, but still a best practice violation).
*   **Fix**: Explicitly set the `search_path` to `public, pg_catalog`.

## Remediation Plan (SQL)
Create `supabase/migrations/20260111110000_fix_rpc_search_path.sql`:

```sql
/**
 * RE-DEFINE Transaction RPC with Immutable Search Path
 * Fixes "Function Search Path Mutable" Advisory.
 */

CREATE OR REPLACE FUNCTION public.create_order_transaction(
    p_order JSONB,
    p_items JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog -- <--- THE FIX
AS $$
DECLARE
    item JSONB;
    product_record RECORD;
    v_order_id TEXT;
    v_stock INT;
BEGIN
    -- (Same Body as before) 
    -- ...
END;
$$;
```

## Definition of Done
*   Advisory cleared.
*   Checkout still works.
