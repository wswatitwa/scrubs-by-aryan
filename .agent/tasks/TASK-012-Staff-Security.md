# Task 012: Staff Security & Profile Integration

**Priority:** Critical
**Triggered By:** Supabase Security Advisory & Tech Debt

## Objective
1.  Secure the `staff_profiles` table (RLS).
2.  Switch Admin Authentication from "Mock LocalStorage" to "Real Supabase Session".
3.  Fetch actual Admin details (Name, Role) from the `staff_profiles` table upon login.

## The Problems
1.  **Security Risk**: `staff_profiles` table has policies but RLS is disabled (Open Access).
2.  **Auth Risk**: `AdminContext` relies on `localStorage.getItem('crubs_staff_session')` instead of the live Supabase Session. If the cryptographic token expires, the UI still thinks the user is logged in.
3.  ** UX Debt**: Admins see "Loading..." or generic names because we don't fetch their profile.

## Action Plan

### 1. Database Remediation (SQL)
Create `supabase/migrations/20260111090000_fix_staff_security.sql`:
*   `ALTER TABLE staff_profiles ENABLE ROW LEVEL SECURITY;`
*   Ensure policies exist (advisory says they do, but we will re-assert them to be safe/idempotent).
    *   `Admins can view all profiles`.
    *   `Users can view own profile`.

### 2. Update `AdminContext.tsx`
*   **Remove**: `localStorage` logic for 'crubs_staff_session'.
*   **Add**:
    ```typescript
    useEffect(() => {
        // 1. Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) fetchProfile(session.user.id);
        });

        // 2. Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) fetchProfile(session.user.id);
            else setCurrentStaff(null);
        });
        
        return () => subscription.unsubscribe();
    }, []);
    ```
*   **Implement `fetchProfile(userId)`**: Query `staff_profiles` by ID.

### 3. Update `AuthPortal.tsx`
*   Simplify `handleLogin`. It no longer needs to call `onLogin` with a dummy object. `supabase.auth.signIn...` will trigger the listener in `AdminContext`.

## Definition of Done
*   `staff_profiles` RLS is ENABLED.
*   Logging out of Supabase (or token expiry) immediately kicks the user to the login screen.
*   Admin Dashboard displays the correct Staff Name from the database.
