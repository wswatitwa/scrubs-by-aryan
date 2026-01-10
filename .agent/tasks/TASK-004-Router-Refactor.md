# Task 004: Router Refactor & De-Monolith

**Priority:** High
**Prerequisite:** Task 001

## Objective
Break `src/App.tsx` (900+ lines) into a standard Routing structure using `react-router-dom`.

## Architecture

### 1. `src/router.tsx` (New)
Define the `createBrowserRouter` or `<Routes>` structure:
*   `/` -> `StoreLayout` -> `HomePage`
*   `/category/:slug` -> `StoreLayout` -> `CategoryPage` (Replaces `ApparelPage`, etc., with one dynamic component if possible, or keeps them if distinct)
    *   *Note*: The current pages (`ApparelPage`, etc.) are distinct components. Keep them for now mapped to `/apparel`, `/footwear`, etc.
*   `/admin` -> `AdminLayout` (Protected Route) -> `AdminDashboard`
*   `/checkout` -> `CheckoutPage` (Extract from modal if desired, or keep as modal on StoreLayout)

### 2. `src/layouts/StoreLayout.tsx` (New)
*   Contains: `Navbar`, `FlashSaleBanner`, `CartSidebar`, `ChatWidget` (AI Assistant), `Footer`.
*   Renders `<Outlet />` for the page content.

### 3. `src/layouts/AdminLayout.tsx` (New)
*   Contains: `AdminNavbar` (extract if needed), `AdminSidebar` (if we add one).
*   Checks `useAuth()` protection.

### 4. `src/App.tsx` (Refactor)
*   Should shrink to < 50 lines.
*   Providers: `AuthProvider`, `RouterProvider`.

## Definition of Done
*   `App.tsx` is clean.
*   Navigation works via URL (e.g., refresh on `/apparel` stays on `/apparel`).
*   Browser Back/Forward buttons work correctly.
