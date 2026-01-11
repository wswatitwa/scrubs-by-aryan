# Task 014: Phase 2 UX Polish & Fixes

**Priority:** Critical (User Feedback)
**Trigger:** PM Audit & User Reports

## Objective
Fix critical UX/Technical gaps blocking smooth operation in Phase 2.

## Issues & Fixes

### 1. Dynamic Routing (The "404" Fix)
*   **Problem**: New Categories do not generate pages.
*   **Fix**:
    *   Update `App.tsx` routes.
    *   Remove hardcoded category paths (`/apparel`, etc.).
    *   Add a wildcard route: `path: ':categorySlug'` -> `CategoryPage`.
    *   Update `CategoryPage.tsx` to read `useParams().categorySlug` and fetch relevant products.

### 2. Navbar Layout (The "Vanishing Cart" Fix)
*   **Problem**: Many categories break the layout, hiding the Cart button.
*   **Fix**:
    *   Refactor `Navbar.tsx` "Categories" section.
    *   Implement a **Scrollable Container** (`overflow-x-auto`) for the direct links.
    *   Style it to look premium (hide scrollbar, fade edges).

### 3. Admin Inventory Feedback (The "Is it Live?" Fix)
*   **Problem**: Admins unsure if added items are actually public.
*   **Fix**:
    *   Update `InventorySection.tsx` Product Card.
    *   Add a **"🔴 LIVE"** blinking indicator if the product is active/stocked.
    *   Ensure the "Success" toast is prominent.

## Execution Order
1.  **Router**: Fix `App.tsx` & `CategoryPage.tsx`.
2.  **Navbar**: Fix CSS overflow.
3.  **Admin**: Add Visual Feedback.

## Definition of Done
*   Creating "Lab Coats" category immediately allows visiting `/lab-coats`.
*   Adding 20 categories does not break Navbar.
*   Added Products show a "LIVE" badge in Admin.
