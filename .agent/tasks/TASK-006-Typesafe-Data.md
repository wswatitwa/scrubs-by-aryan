# Task 006: Typesafe Data Layer (Zod Integration)

**Priority:** Medium
**Prerequisite:** Task 002 (DB Schema Stable)

## Objective
Eliminate the fragile manual mapping between Database `snake_case` and Frontend `camelCase`. Introduced a strict schema validation layer using `zod`.

## Problem
Currently, `supabaseService.ts` manually maps fields:
```typescript
// Fragile!
originalPrice: p.original_price, 
```
If the DB changes, this breaks silently.

## Solution Architecture

### 1. Install Zod
*   (If not installed) `npm install zod`

### 2. Create `src/types/schema.ts`
Define Zod schemas that mirror the Database exactly:
```typescript
import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  name: z.string(),
  original_price: z.number().nullable(),
  // ... all DB fields
});

// Infer the type
export type DbProduct = z.infer<typeof ProductSchema>;
```

### 3. Create a Transformation Layer
Create a utility validation function:
```typescript
export const toAppProduct = (dbRecord: DbProduct): Product => {
  // Validate first
  const parsed = ProductSchema.parse(dbRecord);
  
  // Transform
  return {
    ...parsed,
    originalPrice: parsed.original_price,
    // ...
  };
}
```

### 4. Update Services
Refactor `supabaseService.ts` to use `toAppProduct` instead of manual inline mapping.

## Definition of Done
*   All `any` types in `supabaseService.ts` are replaced with `DbProduct`.
*   Data fetching fails loudly (with Zod errors) if the DB schema doesn't match the expectation, preventing silent UI bugs.
