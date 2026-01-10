# Task 003: Authentication Migration (Supabase Auth)

**Priority:** High
**Prerequisite:** Task 001

## Objective
Replace the mock `localStorage`-based "Staff Session" with real Supabase Authentication.

## Implementation Details

### 1. `src/context/AuthContext.tsx` (Create New)
*   Create a Context Provider that wraps the app.
*   Use `supabase.auth.onAuthStateChange` to listen for session updates.
*   Expose: `user`, `session`, `loading`, `signIn(email, password)`, `signOut()`.

### 2. Update `src/components/AuthPortal.tsx`
*   **Current State**: Checks hardcoded user list in `lib/supabase.ts`.
*   **Target State**:
    *   Call `supabase.auth.signInWithPassword({ email, password })`.
    *   Handle errors (Invalid login).

### 3. Update `src/App.tsx` (Interim Step)
*   Replace:
    ```typescript
    const savedSession = localStorage.getItem('crubs_staff_session');
    ```
*   With:
    ```typescript
    const { session } = useAuth();
    ```
*   Ensure the Admin Dashboard only renders if `session.user` is present.

## Schema Requirements
Ensure you have a user enabling "Email Auth" in the Supabase Dashboard.

## Definition of Done
*   User can log in with a real Supabase User (Email/Pass).
*   Session persists on refresh (handled by Supabase client).
*   Logging out clears the session effectively.
