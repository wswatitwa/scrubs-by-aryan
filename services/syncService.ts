import { db } from '../lib/db';
import { api } from './supabaseService';

export class SyncService {
    private isSyncing = false;

    constructor() {
        // Listen for online status
        window.addEventListener('online', () => this.triggerSync());
        // Attempt initial sync on load
        this.triggerSync();

        // Polling fallback every minute
        setInterval(() => this.triggerSync(), 60000);
    }

    async syncOrdersDown() {
        if (!navigator.onLine) return;
        try {
            console.log('⬇️ Downloading orders from Cloud to Local Archive...');
            const orders = await api.getOrders();

            // Save to local IndexedDB (Bulk put is faster)
            // We strip out heavy image data key if strictly needed, but text URLs are fine.
            await db.orders.bulkPut(orders);
            console.log(`✅ Local Archive updated with ${orders.length} orders.`);

        } catch (error) {
            console.error('Failed to sync orders down:', error);
        }
    }

    async triggerSync() {
        if (this.isSyncing || !navigator.onLine) return;
        this.isSyncing = true;
        // console.log('☁️ Starting Cloud Sync...'); // Reduce log noise

        try {
            // 1. Sync UP (Local -> Cloud)
            const pendingItems = await db.syncQueue
                .where('status')
                .equals('pending')
                .toArray();

            if (pendingItems.length > 0) {
                for (const item of pendingItems) {
                    try {
                        await db.syncQueue.update(item.id!, { status: 'syncing' });

                        if (item.table === 'orders' && item.action === 'CREATE') {
                            await api.createOrder(item.data);
                        } else if (item.table === 'orders' && item.action === 'UPDATE') {
                            // Handle Status updates etc.
                            // We need to implement update handler map
                        }

                        await db.syncQueue.delete(item.id!);
                        console.log(`⬆️ Synced ${item.table} #${item.data.id}`);
                    } catch (error) {
                        console.error(`Sync failed for item ${item.id}`, error);
                        await db.syncQueue.update(item.id!, { status: 'pending' });
                    }
                }
            }

            // 2. Sync DOWN (Cloud -> Local Archive)
            // We run this less frequently or on demand, but here is a good place if we want "Automatic"
            // For efficiency, maybe only do this if we haven't in a while. 
            // For now, let's call it.
            await this.syncOrdersDown();

        } catch (error) {
            console.error('Critical Sync Error:', error);
        } finally {
            this.isSyncing = false;
        }
    }
}

export const syncService = new SyncService();
