# Task 008: Sub-Category Integrity & Logic

**Priority:** Medium
**Prerequisite:** Task 006 (Type Safety)

## Objective
Ensure that a Product's `sub_category` is always a valid member of its parent `Category.sub_categories` array.

## The Problem
Currently, an Admin can edit a product and type "Blue Scrubs" as a sub-category even if the Category "Apparel" only lists "Tops" and "Bottoms". This creates "Ghost Products" that might not appear in filters.

## Solution Strategy
We will implement checks at both the **Database Level** (Trigger) and **Application Level** (Zod/Form).

### 1. Database Trigger (Migration)
Create `supabase/migrations/20260110221000_validate_subcategory.sql`.
*   Function: `check_subcategory_validity()`
*   Logic:
    *   `NEW.sub_category` is not null?
    *   Find parent `category` row.
    *   Check if `NEW.sub_category` exists in `parent.sub_categories` array.
    *   If not: RAISE EXCEPTION 'Invalid sub-category'.
*   Trigger: `BEFORE INSERT OR UPDATE ON products`.

### 2. Admin UI Guard (Form)
*   Update `ProductDetailsModal` (or the new Admin Product Form).
*   When "Category" is selected, the "Sub-Category" dropdown must limit options to that Category's list.
*   Disable free-text entry for Sub-Category (Force selection).

## Definition of Done
*   Database rejects an INSERT with a fake sub-category.
*   Admin UI only offers valid sub-categories.
