import { z } from 'zod';

// --- Database Schemas (snake_case) ---

export const DbProductSchema = z.object({
    id: z.string(),
    created_at: z.string().optional(), // Often optional on insert, present on select
    name: z.string(),
    category: z.string(),
    price: z.number(),
    original_price: z.number().nullable().optional(),
    description: z.string(),
    image: z.string(),
    is_featured: z.boolean().optional(),
    stock: z.number(),
    embroidery_price: z.number().optional(),
    colors: z.array(z.object({ name: z.string(), hex: z.string() })).optional(),
    sizes: z.array(z.string()).optional(),
    styles: z.array(z.string()).optional(),
    materials: z.array(z.string()).optional(),
    package_size: z.string().optional(),
    model: z.string().optional(),
    warranty: z.string().optional(),
    includes: z.array(z.string()).optional(),
    sub_category: z.string().optional(),
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
