# Task 010: Customer Accounts & Loyalty (The "Retention" Engine)

**Priority:** High (Growth Phase)
**Scheduled:** Tomorrow
**Prerequisite:** Task 003 (Auth Foundation)

## Objective
Enable customers to create accounts, save delivery details, and view their order history.

## Architecture

### 1. Database Schema (Supabase)
We need to store customer data securely and link it to their Orders.

*   **`profiles` Table**:
    *   `id`: uuid (Primary Key, references `auth.users`).
    *   `full_name`: text.
    *   `phone`: text.
    *   `default_shipping_zone`: text (FK).
    *   `saved_locations`: jsonb (Array of address objects).
    *   `created_at`: timestamp.

*   **`orders` Table Modify**:
    *   Add `user_id`: uuid (Nullable, references `auth.users`).
    *   *Why Nullable?* We must keep Guest Checkout working.

*   **RLS Policies**:
    *   `profiles`: Users can READ/UPDATE their own row ONLY.
    *   `orders`: Users can READ rows where `auth.uid() == user_id`.

### 2. Authentication Flow
*   **Sign Up/Login**:
    *   Use Supabase Email/Password or potentially Google Auth.
    *   Entry Point: "My Account" icon in Navbar.

### 3. Frontend Implementation
*   **`src/pages/AccountPage.tsx`**:
    *   **Tab A: Order History**: List fetching from `orders` where `user_id = me`.
    *   **Tab B: Settings**: Form to update Name, Phone, and manage Saved Addresses.
*   **`src/services/userService.ts`**:
    *   Methods: `getProfile()`, `updateProfile()`, `getMyOrders()`.
*   **Checkout Integration**:
    *   If Logged In: Pre-fill Name, Phone, Location.
    *   On Submit: Attach `user_id` to the order payload.

## Execution Steps
1.  **Migration**: Create `20260111_customer_profiles.sql`.
2.  **Service**: Build `userService`.
3.  **UI**: Build `AccountPage` + Route `/account`.
4.  **Integration**: Wire up `ShopContext` to handle "User" state (distinct from "Admin").
