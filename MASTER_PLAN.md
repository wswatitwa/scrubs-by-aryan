# Master Blueprint: The Path to Sovereign Scale

**Version:** 1.0.0
**Architect:** Antigravity (Sovereign CTO)
**Date:** 2026-01-10

---

## 1. Project Health Summary

### 🟢 Strengths
*   **Offline-First Architecture**: excellent use of `Dexie.js` and `syncQueue` ensures the store works in low-connectivity environments.
*   **Visual Polish**: The frontend has a distinct, premium "Clinical/Cyber" aesthetic with custom Tailwind styling.
*   **Mobile Optimization**: Recent work has successfully optimized the mobile experience.

### 🔴 Critical Vulnerabilities (The "Danger Zone")
*   **"God Component" Architecture**: `App.tsx` controls *everything* (Routing, State, Data Fetching, UI Layout). This is a bottleneck for scalability and debugging.
*   **Security Gaps**: 
    *   `products` table RLS is strictly wide open (`WITH CHECK (true)`).
    *   Staff Authentication is hardcoded mocks in `lib/supabase.ts`.
*   **Fragile Data Integrity**: No Foreign Key constraints between `products` and `categories`. Mappings between DB `snake_case` and App `camelCase` are manual and fragile.

### 🟡 Technical Debt
*   **Routing**: Custom `window.location` routing inhibits standard browser navigation features and code splitting.
*   **Type Safety**: Manual type assertions in API services mask potential runtime errors.

---

## 2. Strategic Roadmap

Our goal is to transition from a "Prototype" to a "Production-Grade Platform".

### Phase 1: Foundation & Security (The "Iron Dome")
*   **Objective**: Secure the data and stabilize the architecture.
*   **Actions**:
    *   Implement strict Row Level Security (RLS) on Supabase.
    *   Transition Staff Auth to Supabase Auth.
    *   Refactor `App.tsx` into domain-specific Contexts/Hooks and standard Routing.

### Phase 2: Operations & Data Integrity (The "Neural Link")
*   **Objective**: ensure the Back Office (Admin) mirrors the specific needs of the Front Office transparently.
*   **Actions**:
    *   Enforce Foreign Key constraints for Categories/Inventory.
    *   Implement "Realtime Inventory 2.0" (prevent overselling).
    *   Build a dedicated Admin Layout (separate from Storefront).

### Phase 3: Customer Experience & Growth (The "Frontier")
*   **Objective**: Maximize conversion and retention.
*   **Actions**:
    *   Implement User Accounts (Customer History, Favorites).
    *   Advanced Search (Typos, Filters).
    *   Performance Ops (Image optimization, Code splitting).

---

## 3. Epic #1: Architecture & Security Hardening

**Goal**: Eliminate the "God Component" and lock down the Database.

### Task 1.1: Database Schematics & Security (✅ COMPLETED)
*   **Deliverable**: `migrations/20260110_security_hardening.sql`
*   **Details**:
    *   Drop insecure policies.
    *   Enable RLS on all tables.
    *   Create `staff` profiles table linked to `auth.users`.
    *   Add FK constraints (Products -> Categories).

### Task 1.2: Authentication Migration (✅ COMPLETED)
*   **Deliverable**: Update `AuthPortal` and `App.tsx`.
*   **Details**:
    *   Replace `localStorage` mock session with `supabase.auth.signInWithPassword`.
    *   Protect Admin Routes via standard Auth Guards.

### Task 1.3: The Great Refactor (✅ COMPLETED)
*   **Deliverable**: Modular Architecture with `react-router-dom`.
*   **Details**:
    *   **Monolith Smashed**: `App.tsx` decomposed into `StoreLayout` and `AdminLayout`.
    *   **Dynamic Routing**: Replaced 6 hardcoded Category pages with a single smart `CategoryPage.tsx`.
    *   **State Separation**: Implemented `ShopContext` (Public) vs `AdminContext` (Private).
    *   **Security**: Admin routes isolated under `/BLUE-SKYWATITWA` with strict guards.

### Task 1.4: Typesafe Data Layer (✅ COMPLETED)
*   **Deliverable**: Zod Validation Layer.
*   **Details**:
    *   Installed `zod`.
    *   Defined strict DB Schemas in `src/types/schema.ts`.
    *   Refactored `supabaseService.ts` to validate data on read.

---

## Phase 2: Operations (The "Neural Link")
**Current Status**: Ready to Start.

### Task 2.1: Realtime Inventory 2.0 (✅ COMPLETED)
*   **Deliverable**: Atomic Database Transactions.
*   **Details**:
    *   `create_order_transaction` RPC function deployed.
    *   Frontend now prioritizes Server-Side validation when online.
    *   Falls back to Optimistic UI when offline.

### Task 2.2: Sub-Category Integrity (✅ COMPLETED)
*   **Deliverable**: Database Constraint Trigger.
*   **Details**:
    *   Deployed `validate_subcategory` trigger.
    *   Confirmed Admin UI restricts inputs to valid options only.

### Task 2.3: Security Hardening (Reviews) (✅ COMPLETED)
*   **Trigger**: Supabase Advisory.
*   **Deliverable**: RLS Policies for Reviews.
*   **Details**:
    *   Enabled RLS on `reviews`.
    *   **Marketplace**: Allowed Public Read/Insert.
    *   **Moderation**: Restricted Delete/Update to Staff.

### Task 2.4: Staff Security & Profiles (✅ COMPLETED)
*   **Trigger**: Supabase Advisory.
*   **Deliverable**: RLS Policies & Real Auth Sync.
*   **Details**:
    *   Enabled RLS on `staff_profiles`.
    *   `AdminContext` now driven by `supabase.auth`.
    *   Admin Identity is live and secure.

---

### Task 2.5: UX Polish & Fixes (TASK-014) (✅ COMPLETED)
*   **Deliverable**: Dynamic Router & Navbar Fixes.
*   **Details**:
    *   **Router**: `:categorySlug` wildcard implemented.
    *   **Navbar**: Scrollable container prevents overflow.
    *   **Admin**: "Live" status badge added.

---

## Phase 3: The Frontier (Customer Experience)
**Current Status**: 🟢 Active.

### Task 3.1: Performance & SEO (✅ COMPLETED)
*   **Deliverable**: `react-helmet-async` engine.
*   **Details**:
    *   Implemented Global SEO wrapper.
    *   Dynamic Titles for Pages/Categories.
    *   Optimized `HomePage` structure.

### Task 3.2: User Accounts (Customer)
*   **Status**: 📅 Scheduled for Tomorrow.
*   **Plan**: `TASK-010-User-Accounts.md`.
*   **Goal**: Retention & Fast Checkout.
*   **Details**:
    *   `profiles` table linked to Auth.
    *   `orders` table updated with `user_id`.
    *   `AccountPage` for History/Settings.



---

## 4. Execution Rules
1.  **No Broken Builds**: Every commit must result in a runnable state.
2.  **Mobile First**: QA every view on mobile dimensions.
3.  **Secure by Design**: Never commit code that exposes data globally without explicit reason.
