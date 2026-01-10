# supabase Inventory Implementation Plan

## 1. Schema Audit & Current State

### **Current Database Schema**
*   **`products` Table**:
    *   Primary Identifier: `id` (Text/UUID).
    *   Categorization: `category` (Text), `sub_category` (Text).
    *   **Relationships**: Currently **loose**. No Foreign Key constraints linking `category` to the `categories` table.
    *   **RLS Status**: ⚠️ **CRITICAL SECURITY RISK**. The current policy `fix_products_rls.sql` sets `WITH CHECK (true)` for `INSERT/UPDATE/DELETE`. This allows strictly *anyone* (even anonymous users if they generated a token or if policies cascade loosely) to modify inventory if not locked down by other means.
*   **`categories` Table**:
    *   Structure: `id`, `name` (Unique), `sub_categories` (Text Array `TEXT[]`).
    *   **Relationship**: One-to-Many is handled by storing sub-categories as an array of strings within the category row.
    *   **RLS Status**: Secure (`auth.role() = 'authenticated'`).

### **Gap Analysis**
1.  **Security**: Products table is wide open. Needs immediate lockdown to `authenticated` staff only.
2.  **Data Integrity**:
    *   If a Category name changes in `categories`, `products` will be orphaned (unless cascading updates are manually handled).
    *   `products.sub_category` implies a relationship but enforces none. A product can have a sub-category that doesn't exist in the Category's array.
3.  **Realtime**: Both `products` and `categories` are added to the `supabase_realtime` publication. Frontend Listeners are present in `App.tsx`.

---

## 2. Proposed Improvements (The "Robust" Plan)

To meet the requirement of a "Robust" system while maintaining speed, I propose the following:

### **Phase 1: Security & Integrity (Immediate)**
1.  **Fix RLS for Products**:
    *   Update policies to strictly allow only `auth.role() = 'authenticated'` (or specific admin role) for CUD (Create, Update, Delete) operations.
    *   Keep Public Read (`SELECT`) open.
2.  **Hard-Link Categories**:
    *   Add a **Foreign Key Constraint** on `products.category` referencing `categories.name`.
    *   Enable `ON UPDATE CASCADE` so that renaming a category automatically updates all its products.
    *   *Note*: This allows us to keep the legacy text-based column used by the Frontend while enforcing SQL-level integrity.

### **Phase 2: Sub-Category Refinement (Recommended)**
*   *Current*: `sub_categories` is a string array in `categories`.
*   *Issue*: Hard to query "All products in subcategory X" efficiently or rename a sub-category globally.
*   *Decision*: For vastly improved robustness, we should eventually move to a `sub_categories` table. **However**, given the priority to "Complete Inventory System" now without breaking the frontend, we will **stick to the Array approach** for Phase 1 but add a **Validation Trigger**:
    *   Ensure that when a Product is added, its `sub_category` actually exists in the referenced Category's array (Optional, but adds robustness).

---

## 3. Implementation Checklist

### **Database Migrations**
- [ ] Create `20260110_secure_inventory.sql`:
    - [ ] Drop insecure RLS policies on `products`.
    - [ ] Re-create policies enforcing `auth.role() = 'authenticated'`.
    - [ ] Add Foreign Key: `ALTER TABLE products ADD CONSTRAINT fk_category FOREIGN KEY (category) REFERENCES categories(name) ON UPDATE CASCADE;`.

### **Realtime Sync Verification**
- [ ] **Frontend**: `App.tsx` already has `subscribeToProducts` and `subscribeToCategories`.
- [ ] **Backend**: Ensure `supabase_realtime` publication includes `products` and `categories` (Already done in `20260109...`).
- [ ] **Test**: Open store in Incognito (Front Office) and Admin Dashboard (Back Office). Edit a price/name. Verify instant update.

### **Frontend Logic (Inventory Flow)**
- [ ] **Add/Edit Product Modal**:
    - [ ] Ensure the "Category" dropdown is populated dynamically from the `categories` table (currently might be hardcoded in `constants.ts`).
    - [ ] Ensure "Sub-Category" dropdown filters based on selected Category.
- [ ] **Category Management**:
    - [ ] Verify `addCategory` service correctly formats the `sub_categories` array.

---

## 4. Execution Plan
1.  **Approval**: Waiting for user approval of this plan.
2.  **Migration**: Run the Security & Integrity migration.
3.  **Code Check**: Verify `ProductDetailsModal` or Admin forms use the dynamic Categories list, not just `constants.ts`.
4.  **Verification**: Perform a live "Admin acts, Shop reacts" test.
