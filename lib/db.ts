import Dexie, { Table } from 'dexie';
import { Product, Order, StoreSettings } from '../types';

// Define the schema for the local database
export class CrubsDatabase extends Dexie {
    products!: Table<Product, string>;
    orders!: Table<Order, string>;
    syncQueue!: Table<{
        id?: number; // Auto-incremented
        table: string; // 'orders', 'products'
        action: 'CREATE' | 'UPDATE' | 'DELETE';
        data: any;
        timestamp: number;
        status: 'pending' | 'syncing' | 'failed';
    }, number>;
    settings!: Table<StoreSettings, number>;

    constructor() {
        super('CrubsLocalDB');
        this.version(1).stores({
            products: 'id, category, name, stock', // Indexed fields for searching
            orders: 'id, customerName, status, createdAt', // Indexed fields
            syncQueue: '++id, table, status, timestamp', // Queue for offline syncing
            settings: '++id'
        });
    }
}

export const db = new CrubsDatabase();

// --- Sync Logic Wrapper ---

// Add Order: Saves to local DB and adds to sync queue
export async function saveOrderLocally(order: Order, isOnline: boolean) {
    return await db.transaction('rw', db.orders, db.syncQueue, async () => {
        await db.orders.put(order);

        // Always add to queue, the sync service will handle immediate sending if online
        // This ensures consistency.
        await db.syncQueue.add({
            table: 'orders',
            action: 'CREATE',
            data: order,
            timestamp: Date.now(),
            status: 'pending'
        });
    });
}

// Similar functions can be made for products...
