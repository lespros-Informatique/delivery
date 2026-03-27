/**
 * Simple In-Memory Cache Service
 * ===========================================
 * Basic cache with TTL (Time To Live) support
 * Used for static or rarely changing data
 */

interface CacheEntry<T> {
    value: T;
    expiry: number;
}

export class CacheService {
    private cache = new Map<string, CacheEntry<any>>();

    /**
     * Set a value in cache
     * @param key - Cache key
     * @param value - Value to store
     * @param ttlMs - Time to live in milliseconds
     */
    set<T>(key: string, value: T, ttlMs: number): void {
        const expiry = Date.now() + ttlMs;
        this.cache.set(key, { value, expiry });
    }

    /**
     * Get a value from cache
     * @param key - Cache key
     */
    get<T>(key: string): T | null {
        const entry = this.cache.get(key);

        if (!entry) {
            return null;
        }

        if (Date.now() > entry.expiry) {
            this.cache.delete(key);
            return null;
        }

        return entry.value as T;
    }

    /**
     * Delete a value from cache
     * @param key - Cache key
     */
    del(key: string): void {
        this.cache.delete(key);
    }

    /**
     * Delete all keys starting with a prefix
     * @param prefix - Key prefix
     */
    delByPrefix(prefix: string): void {
        for (const key of this.cache.keys()) {
            if (key.startsWith(prefix)) {
                this.cache.delete(key);
            }
        }
    }

    /**
     * Clear all cache
     */
    clear(): void {
        this.cache.clear();
    }
}

export const cacheService = new CacheService();
export default cacheService;
