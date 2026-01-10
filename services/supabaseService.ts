import { supabase } from '../lib/supabase';
import { Product, Order, ShippingZone, TenderInquiry, StoreSettings, StaffMember, Review, SocialMediaLinks } from '../types';

export const api = {
    // --- Products ---
    async getProducts(): Promise<Product[]> {
        const { data, error } = await supabase
            .from('products')
            .select('*, reviews(*)');

        if (error) {
            console.error('Error fetching products:', error);
            return [];
        }

        // Map DB snake_case to camelCase
        return data?.map((p: any) => ({
            ...p,
            subCategory: p.sub_category,
            originalPrice: p.original_price,
            isFeatured: p.is_featured,
            embroideryPrice: p.embroidery_price,
            packageSize: p.package_size
        })) as Product[];
    },

    async createProduct(product: Product): Promise<Product | null> {
        // Separate reviews from product object as they are in a different table
        const { reviews, ...productData } = product;

        // Map camelCase to snake_case for DB columns if they differ (our schema uses snake_case potentialy? 
        // actually our schema used the exact names or we need to map them.
        // Let's verify the schema we wrote. 
        // Schema: embroidery_price, original_price, is_featured, package_size.
        // TS: embroideryPrice, originalPrice, isFeatured, packageSize.
        // We need to map these manually or use a transformer.
        // For simplicity, let's map manually here.

        const dbProduct = {
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            original_price: product.originalPrice,
            description: product.description,
            image: product.image,
            is_featured: product.isFeatured,
            stock: product.stock,
            embroidery_price: product.embroideryPrice,
            colors: product.colors,
            sizes: product.sizes,
            styles: product.styles,
            materials: product.materials,
            package_size: product.packageSize,
            model: product.model,
            warranty: product.warranty,
            includes: product.includes,
            sub_category: product.subCategory
        };

        const { data, error } = await supabase.from('products').insert(dbProduct).select().single();
        if (error) {
            console.error('Error creating product:', error);
            return null;
        }
        return data ? { ...product } : null; // Return original assuming success or mapped data
    },

    async updateProduct(product: Product): Promise<Product | null> {
        const { reviews, ...productData } = product;
        const dbProduct = {
            name: product.name,
            category: product.category,
            price: product.price,
            original_price: product.originalPrice,
            description: product.description,
            image: product.image,
            is_featured: product.isFeatured,
            stock: product.stock,
            embroidery_price: product.embroideryPrice,
            colors: product.colors,
            sizes: product.sizes,
            styles: product.styles,
            materials: product.materials,
            package_size: product.packageSize,
            model: product.model,
            warranty: product.warranty,
            includes: product.includes,
            sub_category: product.subCategory
        };

        const { data, error } = await supabase.from('products').update(dbProduct).eq('id', product.id).select().single();
        if (error) {
            console.error('Error updating product:', error);
            return null;
        }
        return data ? { ...product } : null;
    },

    async deleteProduct(id: string): Promise<void> {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) console.error('Error deleting product:', error);
    },

    // --- Categories ---
    async getCategories(): Promise<any[]> {
        const { data, error } = await supabase.from('categories').select('*').order('name');
        if (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
        return data.map((c: any) => ({
            id: c.id,
            name: c.name,
            path: c.path,
            subCategories: c.sub_categories || []
        }));
    },

    async addCategory(name: string, subCategories: string[] = []): Promise<any | null> {
        const path = '/' + name.toLowerCase().replace(/ /g, '-');
        const { data, error } = await supabase.from('categories').insert({ name, path, sub_categories: subCategories }).select().single();
        if (error) {
            console.error('Error adding category:', error);
            return null;
        }
        return {
            id: data.id,
            name: data.name,
            path: data.path,
            subCategories: data.sub_categories
        };
    },

    async updateCategory(id: string, updates: { name?: string, subCategories?: string[] }): Promise<void> {
        const dbUpdates: any = {};
        if (updates.name) {
            dbUpdates.name = updates.name;
            dbUpdates.path = '/' + updates.name.toLowerCase().replace(/ /g, '-');
        }
        if (updates.subCategories) {
            dbUpdates.sub_categories = updates.subCategories;
        }

        const { error } = await supabase.from('categories').update(dbUpdates).eq('id', id);
        if (error) console.error('Error updating category:', error);
    },

    async deleteCategory(id: string): Promise<void> {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) console.error('Error deleting category:', error);
    },

    // --- Reviews ---
    async addReview(productId: string, review: Review): Promise<void> {
        const dbReview = {
            id: review.id,
            product_id: productId,
            user_name: review.userName,
            rating: review.rating,
            comment: review.comment,
            date: review.date,
            is_verified: review.isVerified
        };
        const { error } = await supabase.from('reviews').insert(dbReview);
        if (error) console.error('Error adding review:', error);
    },

    // --- Orders ---
    async getOrders(): Promise<Order[]> {
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (error) {
            console.error('Error fetching orders:', error);
            return [];
        }

        // Map snake_case to camelCase
        return data.map((o: any) => ({
            id: o.id,
            customerName: o.customer_name,
            customerPhone: o.customer_phone,
            location: o.location,
            items: o.items,
            subtotal: o.subtotal,
            shippingFee: o.shipping_fee,
            total: o.total,
            status: o.status,
            mpesaCode: o.mpesa_code,
            shippingMethod: o.shipping_method,
            notes: o.notes,
            createdAt: o.created_at
        }));
    },

    async createOrder(order: Order): Promise<void> {
        const dbOrder = {
            id: order.id,
            customer_name: order.customerName,
            customer_phone: order.customerPhone,
            location: order.location,
            items: order.items,
            subtotal: order.subtotal,
            shipping_fee: order.shippingFee,
            total: order.total,
            status: order.status,
            mpesa_code: order.mpesaCode,
            shipping_method: order.shippingMethod,
            notes: order.notes,
            created_at: order.createdAt
        };
        const { error } = await supabase.from('orders').insert(dbOrder);
        if (error) console.error('Error creating order:', error);
    },

    async updateOrderStatus(id: string, status: string): Promise<void> {
        const { error } = await supabase.from('orders').update({ status }).eq('id', id);
        if (error) console.error('Error updating order:', error);
    },

    // --- Shipping Zones ---
    async getShippingZones(): Promise<ShippingZone[]> {
        const { data, error } = await supabase.from('shipping_zones').select('*');
        if (error) return [];
        return data.map((z: any) => ({
            id: z.id,
            name: z.name,
            fee: z.fee,
            estimatedDays: z.estimated_days
        }));
    },

    async createShippingZone(zone: ShippingZone): Promise<void> {
        const dbZone = {
            id: zone.id,
            name: zone.name,
            fee: zone.fee,
            estimated_days: zone.estimatedDays
        };
        const { error } = await supabase.from('shipping_zones').insert(dbZone);
        if (error) console.error(error);
    },

    async deleteShippingZone(id: string): Promise<void> {
        await supabase.from('shipping_zones').delete().eq('id', id);
    },

    // --- Tenders ---
    async getTenders(): Promise<TenderInquiry[]> {
        const { data, error } = await supabase.from('tenders').select('*').order('created_at', { ascending: false });
        if (error) return [];
        return data.map((t: any) => ({
            id: t.id,
            orgName: t.org_name,
            contactPerson: t.contact_person,
            email: t.email,
            phone: t.phone,
            productCategory: t.product_category,
            estimatedQuantity: t.estimated_quantity,
            requirements: t.requirements,
            status: t.status,
            createdAt: t.created_at
        }));
    },

    async createTender(tender: TenderInquiry): Promise<void> {
        const dbTender = {
            id: tender.id,
            org_name: tender.orgName,
            contact_person: tender.contactPerson,
            email: tender.email,
            phone: tender.phone,
            product_category: tender.productCategory,
            estimated_quantity: tender.estimatedQuantity,
            requirements: tender.requirements,
            status: tender.status,
            created_at: tender.createdAt
        };
        const { error } = await supabase.from('tenders').insert(dbTender);
        if (error) console.error(error);
    },

    // --- Social Media ---
    async getSocialLinks(): Promise<SocialMediaLinks> {
        const { data, error } = await supabase.from('social_links').select('*').single();
        if (error || !data) {
            return {
                whatsapp: '+254 722 435698',
                facebook: 'https://web.facebook.com/p/Scrubs-by-Aryan-Ke-61554847971027/?_rdc=1&_rdr#',
                instagram: '',
                facebookPostUrl: ''
            };
        }
        return {
            whatsapp: data.whatsapp,
            facebook: data.facebook,
            instagram: data.instagram,
            facebookPageId: data.facebook_page_id,
            instagramToken: data.instagram_token,
            facebookPostUrl: data.facebook_post_url
        };
    },

    async updateSocialLinks(links: SocialMediaLinks): Promise<void> {
        const dbLinks = {
            id: 1, // Singleton row
            whatsapp: links.whatsapp,
            facebook: links.facebook,
            instagram: links.instagram,
            facebook_page_id: links.facebookPageId,
            instagram_token: links.instagramToken,
            facebook_post_url: links.facebookPostUrl
        };
        const { error } = await supabase.from('social_links').upsert(dbLinks);
        if (error) console.error('Error updating social links:', error);
    },

    // --- Settings ---
    async getStoreSettings(): Promise<StoreSettings> {
        const { data, error } = await supabase.from('store_settings').select('embroidery_fee').single();
        if (error || !data) return { embroideryFee: 300 };
        return { embroideryFee: data.embroidery_fee };
    },

    async updateStoreSettings(settings: StoreSettings): Promise<void> {
        const { error } = await supabase.from('store_settings').update({ embroidery_fee: settings.embroideryFee }).eq('id', 1);
        if (error) console.error(error);
    },

    // --- Staff ---
    async getStaff(): Promise<StaffMember[]> {
        const { data, error } = await supabase.from('staff').select('*');
        if (error) return [];
        return data as StaffMember[]; // Assuming column names match or we mapped them? 
        // Staff table columns: id, name, email, role, permissions, password, phone_number
        // StaffMember interface: id, name, email, role, permissions, password, phoneNumber
        // Need mapping for phoneNumber
    },

    // Note: Staff management usually requires more secure handling. 
    // For this migration, we will focus on the core commerce data.
    // --- Realtime ---
    subscribeToOrders(onNewOrder: (order: Order) => void, onUpdateOrder?: (order: Order) => void): any {
        console.log("🔌 Initializing Order Subscription...");
        return supabase
            .channel('public:orders')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'orders' },
                (payload: any) => {
                    const o = payload.new || payload.old; // Payload.new for Insert/Update, Payload.old for Delete (id only usually)
                    if (!payload.new) return; // Ignore deletes for now in this specific flow if we only care about additions/updates

                    console.log(`🔔 Order Update (${payload.eventType}):`, payload);

                    const orderData: Order = {
                        id: o.id,
                        customerName: o.customer_name,
                        customerPhone: o.customer_phone,
                        location: o.location,
                        items: o.items,
                        subtotal: o.subtotal,
                        shippingFee: o.shipping_fee,
                        total: o.total,
                        status: o.status,
                        mpesaCode: o.mpesa_code,
                        shippingMethod: o.shipping_method,
                        notes: o.notes,
                        createdAt: o.created_at
                    };

                    if (payload.eventType === 'INSERT') {
                        onNewOrder(orderData);
                    } else if (payload.eventType === 'UPDATE' && onUpdateOrder) {
                        onUpdateOrder(orderData);
                    }
                }
            )
            .subscribe();
    },

    subscribeToProducts(onChange: (eventType: 'INSERT' | 'UPDATE' | 'DELETE', product: Product) => void): any {
        console.log("🔌 Initializing Product Subscription...");
        return supabase
            .channel('public:products')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'products' },
                (payload: any) => {
                    console.log("🔔 Product Update Realtime:", payload);
                    if (payload.eventType === 'DELETE') {
                        // For delete, we only get the ID usually if replica identity is default
                        onChange('DELETE', { id: payload.old.id } as Product);
                        return;
                    }

                    const p = payload.new;
                    const product: Product = {
                        ...p,
                        subCategory: p.sub_category,
                        originalPrice: p.original_price,
                        isFeatured: p.is_featured,
                        embroideryPrice: p.embroidery_price,
                        packageSize: p.package_size
                    };
                    onChange(payload.eventType, product);
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') console.log("✅ Successfully subscribed to products.");
                if (status === 'CHANNEL_ERROR') console.error("❌ Failed to subscribe to products.");
                if (status === 'TIMED_OUT') console.error("⚠️ Product subscription timed out.");
            });
    },

    subscribeToCategories(onChange: (eventType: 'INSERT' | 'UPDATE' | 'DELETE', category: any) => void): any {
        return supabase
            .channel('public:categories')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'categories' },
                (payload: any) => {
                    if (payload.eventType === 'DELETE') {
                        onChange('DELETE', { id: payload.old.id });
                        return;
                    }

                    const c = payload.new;
                    const category = {
                        id: c.id,
                        name: c.name,
                        path: c.path,
                        subCategories: c.sub_categories || []
                    };
                    onChange(payload.eventType, category);
                }
            )
            .subscribe();
    },
};
