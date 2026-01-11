import { z } from 'zod';

// --- Database Schemas (snake_case) ---

export const DbProductSchema = z.object({
    id: z.string(),
    created_at: z.string().optional(), // Often optional on insert, present on select
    name: z.string(),
    category: z.string(),
    price: z.number(),
    original_price: z.number().nullable().optional(),
    description: z.string().nullable().optional(), // Description can sometimes be empty/null
    image: z.string(),
    is_featured: z.boolean().nullable().optional(),
    stock: z.number(),
    embroidery_price: z.number().nullable().optional(),
    colors: z.array(z.object({ name: z.string(), hex: z.string() })).nullable().optional(),
    sizes: z.array(z.string()).nullable().optional(),
    styles: z.array(z.string()).nullable().optional(),
    materials: z.array(z.string()).nullable().optional(),
    package_size: z.string().nullable().optional(),
    model: z.string().nullable().optional(),
    warranty: z.string().nullable().optional(),
    includes: z.array(z.string()).nullable().optional(),
    sub_category: z.string().nullable().optional(),
});

export const DbCategorySchema = z.object({
    id: z.number().or(z.string()), // Supabase IDs can be int or uuid depending on setup
    created_at: z.string().optional(),
    name: z.string(),
    path: z.string(),
    sub_categories: z.array(z.string()).optional(),
});

export const DbOrderSchema = z.object({
    id: z.string(),
    created_at: z.string(),
    customer_name: z.string(),
    customer_phone: z.string(),
    location: z.string(),
    items: z.any(), // Json/JsonB field in DB 
    subtotal: z.number(),
    shipping_fee: z.number(),
    total: z.number(),
    status: z.string(), // 'Pending', 'Processing', etc.
    mpesa_code: z.string(),
    shipping_method: z.string(),
    notes: z.string().nullable().optional(),
});

export const DbTenderSchema = z.object({
    id: z.string(),
    created_at: z.string(),
    org_name: z.string(),
    contact_person: z.string(),
    email: z.string(),
    phone: z.string(),
    product_category: z.string(),
    estimated_quantity: z.number(),
    requirements: z.string(),
    status: z.string(),
});

// --- Inferred Types ---
export type DbProduct = z.infer<typeof DbProductSchema>;
export type DbCategory = z.infer<typeof DbCategorySchema>;
export type DbOrder = z.infer<typeof DbOrderSchema>;
export type DbTender = z.infer<typeof DbTenderSchema>;
