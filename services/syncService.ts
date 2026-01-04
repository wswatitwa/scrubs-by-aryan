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

    async triggerSync() {
        if (this.isSyncing || !navigator.onLine) return;
        this.isSyncing = true;
        console.log('☁️ Starting Cloud Sync...');

        try {
            // Get all pending items
            const pendingItems = await db.syncQueue
                .where('status')
                .equals('pending')
                .toArray();

            if (pendingItems.length === 0) {
                console.log('✅ Local Database is in sync.');
                this.isSyncing = false;
                return;
            }

            for (const item of pendingItems) {
                try {
                    // Mark as syncing to prevent double processing
                    await db.syncQueue.update(item.id!, { status: 'syncing' });

                    // Process based on table and action
                    if (item.table === 'orders' && item.action === 'CREATE') {
                        await api.createOrder(item.data);
                    }
                    // Add more handlers here (e.g. products, edits) as we expand

                    // Delete from queue on success
                    await db.syncQueue.delete(item.id!);
                    console.log(`Successfully synced ${item.table} #${item.data.id}`);

                } catch (error) {
                    console.error(`Sync failed for item ${item.id}`, error);
                    // Revert to pending, maybe add retry count later
                    // For now, keep as pending to retry next time
                    await db.syncQueue.update(item.id!, { status: 'pending' }); // Or 'failed' if fatal
                }
            }

        } catch (error) {
            console.error('Critical Sync Error:', error);
        } finally {
            this.isSyncing = false;
        }
    }
}

export const syncService = new SyncService();
