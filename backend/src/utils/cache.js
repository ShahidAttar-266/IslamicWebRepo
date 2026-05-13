const { getRedisClient } = require('../lib/redis');

/**
 * Cache-first wrapper for fetching data.
 * @param {string} key - Cache key.
 * @param {function} fetchFn - Async function to fetch data if cache miss.
 * @param {number} ttlSeconds - TTL in seconds.
 * @returns {Promise<any>}
 */
async function getOrSet(key, fetchFn, ttlSeconds = 300) {
    const redis = getRedisClient();
    
    if (!redis) {
        return await fetchFn();
    }

    try {
        const cachedValue = await redis.get(key);
        if (cachedValue !== null) {
            // Upstash client handles JSON parsing automatically if stored as object
            // but we'll be safe
            return typeof cachedValue === 'string' ? JSON.parse(cachedValue) : cachedValue;
        }
    } catch (error) {
        console.warn(`[CACHE] Error getting key ${key}:`, error.message);
    }

    // Miss or error
    const freshData = await fetchFn();

    try {
        if (freshData !== null && freshData !== undefined) {
            await redis.set(key, JSON.stringify(freshData), { ex: ttlSeconds });
        }
    } catch (error) {
        console.warn(`[CACHE] Error setting key ${key}:`, error.message);
    }

    return freshData;
}

/**
 * Invalidate a single key or a pattern (if client supports scan/delete).
 * For @upstash/redis, we usually delete specific keys or use a naming convention.
 * @param {string} key - Key to delete.
 */
async function invalidate(key) {
    const redis = getRedisClient();
    if (!redis) return;

    try {
        await redis.del(key);
    } catch (error) {
        console.warn(`[CACHE] Error invalidating key ${key}:`, error.message);
    }
}

/**
 * Invalidate multiple keys.
 * @param {string[]} keys - Keys to delete.
 */
async function invalidateMany(keys) {
    const redis = getRedisClient();
    if (!redis || !keys || keys.length === 0) return;

    try {
        await redis.del(...keys);
    } catch (error) {
        console.warn(`[CACHE] Error invalidating multiple keys:`, error.message);
    }
}

/**
 * Invalidate keys by pattern (Simulated for @upstash/redis using KEYS or SCAN)
 * Note: Upstash Redis supports 'keys' command.
 * @param {string} pattern - Pattern to match (e.g., 'names:list:*')
 */
async function invalidatePattern(pattern) {
    const redis = getRedisClient();
    if (!redis) return;

    try {
        const keys = await redis.keys(pattern);
        if (keys && keys.length > 0) {
            await redis.del(...keys);
        }
    } catch (error) {
        console.warn(`[CACHE] Error invalidating pattern ${pattern}:`, error.message);
    }
}

module.exports = {
    getOrSet,
    invalidate,
    invalidateMany,
    invalidatePattern
};
