const { getRedisClient } = require('../lib/redis');

// In-memory cache fallback for serverless warm execution instances
const localCache = new Map();

/**
 * Get item from local in-memory cache, respecting TTL
 */
function getLocal(key) {
    const entry = localCache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
        localCache.delete(key);
        return null;
    }
    // Deep clone to prevent accidental reference mutations
    return JSON.parse(JSON.stringify(entry.value));
}

/**
 * Set item in local in-memory cache
 */
function setLocal(key, value, ttlSeconds) {
    localCache.set(key, {
        value,
        expiresAt: Date.now() + (ttlSeconds * 1000)
    });
}

/**
 * Invalidate a key locally
 */
function invalidateLocal(key) {
    localCache.delete(key);
}

/**
 * Invalidate multiple keys locally
 */
function invalidateManyLocal(keys) {
    if (Array.isArray(keys)) {
        for (const key of keys) {
            localCache.delete(key);
        }
    }
}

/**
 * Invalidate keys by pattern locally
 */
function invalidatePatternLocal(pattern) {
    // Convert glob-like * to regex wildcard
    const regexPattern = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    for (const key of localCache.keys()) {
        if (regexPattern.test(key)) {
            localCache.delete(key);
        }
    }
}

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
        // Bypass local cache in test environment to prevent state leak/pollution between tests
        if (process.env.NODE_ENV === 'test') {
            return await fetchFn();
        }

        const cached = getLocal(key);
        if (cached !== null) {
            return cached;
        }
        
        const freshData = await fetchFn();
        if (freshData !== null && freshData !== undefined) {
            setLocal(key, freshData, ttlSeconds);
        }
        return freshData;
    }

    try {
        const cachedValue = await redis.get(key);
        if (cachedValue !== null) {
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
 * Invalidate a single key.
 * @param {string} key - Key to delete.
 */
async function invalidate(key) {
    invalidateLocal(key);
    
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
    invalidateManyLocal(keys);
    
    const redis = getRedisClient();
    if (!redis || !keys || keys.length === 0) return;

    try {
        await redis.del(...keys);
    } catch (error) {
        console.warn(`[CACHE] Error invalidating multiple keys:`, error.message);
    }
}

/**
 * Invalidate keys by pattern.
 * @param {string} pattern - Pattern to match (e.g., 'names:list:*')
 */
async function invalidatePattern(pattern) {
    invalidatePatternLocal(pattern);
    
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
