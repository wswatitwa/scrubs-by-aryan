# Task 013: Full System Integrity Scan (The "Dry Run")

**Priority:** Critical (Verification)
**Objective:** Validate that all core flows (Guest -> Order -> Admin -> Fulfillment) work seamlessly before adding new complexity.

## Scope of Verification

### 1. The Guest Journey (Front Office)
*   [ ] **Navigation**: Click through all Categories (Apparel, Footwear, etc.). Do they load the correct products?
*   [ ] **Search**: Does the Global Search find specific items?
*   [ ] **Cart**: Add multiple items (various sizes/colors). Does the Cart Sidebar update correctly?
*   [ ] **Checkout**:
    *   Fill details.
    *   **Logic Check**: Does the atomic RPC (`create_order_transaction`) succeed?
    *   **Receipt**: Does the auto-generated receipt download?

### 2. The Admin Journey (Back Office)
*   [ ] **Login**: Access `/BLUE-SKYWATITWA`. Does it demand auth? Login.
*   [ ] **Order Reception**: Does the new Order appear instantly?
*   [ ] **Fulfillment**:
    *   Change Status (Pending -> Paid -> Dispatched).
    *   Does the "Notifications" toast appear?
*   [ ] **Inventory Management**:
    *   Edit a Product's price.
    *   Add a new Product. **Verify**: Does it immediately appear in the Storefront?
    *   **Dynamic Routing Check:** Create a new Category (e.g. "Lab Coats"). Does navigating to `/lab-coats` automatically work and show the products?
    *   **Integrity Check**: Try to add a fake Sub-Category. Does it fail?

### 3. Technical Health
*   [ ] **Browser Console**: Are there any red errors during navigation?
*   [ ] **Network Tab**: Are we seeing efficient RPC calls or duplicated requests?
