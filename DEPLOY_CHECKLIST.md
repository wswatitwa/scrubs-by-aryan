# 🚀 Deployment Checklist: Version 2.0 (Sovereign Update)

**Target:** Production
**Date:** 2026-01-10

---

## 1. Environment Variables & Secrets
Ensure the following variables are set in your Deployment Platform (Vercel/Netlify/etc.):

*   `VITE_SUPABASE_URL`: Your Supabase Project URL.
*   `VITE_SUPABASE_ANON_KEY`: Your Supabase Public Anon Key.
*   `VITE_ADMIN_EMAIL`: (Optional) If you used this for seeding initial staff.

## 2. Database Migrations (CRITICAL)
You made significant changes to the Database schema. You **MUST** run the SQL migrations in your Supabase SQL Editor if you haven't already.

**Order of Operations:**
1.  **Security Hardening**: `supabase/migrations/20260110195000_security_hardening.sql` (Enables RLS, links Products-Categories).
2.  **Atomic Checkout**: `supabase/migrations/20260110220000_checkout_rpc.sql` (Adds `create_order_transaction` RPC).
3.  **Data Integrity**: `supabase/migrations/20260110221000_validate_subcategory.sql` (Adds `validate_subcategory` trigger).

*Verification:*
Run this query in Supabase SQL Editor to confirm logic exists:
```sql
SELECT routine_name FROM information_schema.routines WHERE routine_type='FUNCTION' AND specific_schema='public';
```
Look for `create_order_transaction`.

## 3. Build & Deploy
The build command has been verified locally.

1.  **Command**: `npm run build`
2.  **Output Directory**: `dist`
3.  **Routing Rule**: Since we switched to `react-router-dom`, you must ensure all requests are rewritten to `index.html`.
    *   **Vercel**: Handled automatically.
    *   **Netlify**: Ensure `_redirects` file exists with `/* /index.html 200`.
    *   **Nginx/Apache**: Update config to try_files $uri /index.html.

## 4. Post-Deployment Verification (The "Smoke Test")

### A. Visitor Test
1.  Open the live URL.
2.  Navigate to `/apparel`. Does the URL change without a full page reload?
3.  Refresh the page. Does it stay on `/apparel` (Testing SPA fallback)?

### B. Admin Security Test
1.  Navigate to `/BLUE-SKYWATITWA`.
2.  Should redirect to Login or show Auth Portal.
3.  Log in.
4.  Try to **Add a Product**.
    *   Select "Apparel" Category.
    *   Try to select a Sub-Category. Is the list correct?

### C. Live Purchase Test (Atomic)
1.  As a customer, add "Last Item" to cart.
2.  Checkout.
3.  Verify Order appears in Admin Dashboard immediately.

---

**Status:** READY FOR LAUNCH 🟢
