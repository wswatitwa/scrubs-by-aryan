# Task 005: Hook Extraction (Logic Reform)

**Priority:** Medium
**Prerequisite:** None (Can be done in parallel)

## Objective
Extract data fetching and business logic from `App.tsx` into reusable Custom Hooks.

## Modules

### 1. `src/hooks/useInventory.ts`
*   **State**: `products`, `categories`.
*   **Actions**: `addProduct`, `updateProduct`, `deleteProduct`.
*   **Effect**: Handles the `supabase.channel` subscriptions for products/categories.

### 2. `src/hooks/useOrders.ts`
*   **State**: `orders`.
*   **Actions**: `createOrder`, `updateStatus`.
*   **Effect**: Handles the `supabase.channel` subscription for orders.
*   **Integration**: Includes the `notifyStaff` logic.

### 3. `src/hooks/useCart.ts`
*   **State**: `cartItems`.
*   **Actions**: `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`.
*   **Persistence**: Manage localStorage logic here.

## Definition of Done
*   Logic is moved out of components.
*   Components consume data via `const { products } = useInventory();`.
