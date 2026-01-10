# Task 007: Realtime Inventory 2.0 (Atomic Checkout)

**Priority:** High
**Prerequisite:** Task 006 (Type Safety)

## Objective
Prevent "Race Conditions" where two customers buy the last item simultaneously. Currently, the frontend checks stock, then subtracts it. In the milliseconds between check and subtract, another user could buy it.

## The Solution: Database Transactions (RPC)
We will move the checkout logic to the **Database Layer** using a PostgreSQL Function (RPC). This ensures the check and the deduction happen as a single atomic unit.

## Implementation Steps

### 1. Create Migration SQL
Create `supabase/migrations/20260110220000_checkout_rpc.sql`:
*   Function: `create_order_transaction(order_data jsonb, items_data jsonb)`
*   Logic:
    1.  Start Transaction.
    2.  Insert Order into `orders` table.
    3.  Loop through `items_data`:
        *   Select current stock for Product ID.
        *   If `current_stock < requested_quantity`: RAISE EXCEPTION 'Insufficient stock for product %', product_name.
        *   Update `products` set `stock = stock - quantity`.
    4.  Return Order ID.

### 2. Update `supabaseService.ts`
*   Add method `processCheckout(order: Order): Promise<{ success: boolean, error?: string }>`.
*   Call `supabase.rpc('create_order_transaction', { ... })`.

### 3. Update Frontend (Checkout)
*   Modify `CheckoutPage` or `MpesaPayment` component.
*   Instead of `handleCreateOrder` (client-side), call `api.processCheckout`.
*   Catch errors: If "Insufficient stock" error returns, alert the user and block the sale.

## Definition of Done
*   Simultaneous purchases of the last item result in ONE success and ONE failure.
*   Inventory never goes below 0.
