const { Redis } = require('@upstash/redis');

let redis = null;

const getRedisClient = () => {
    if (!redis) {
        if (!process.env.REDIS_URL || !process.env.REDIS_TOKEN) {
            console.warn('[REDIS] Missing REDIS_URL or REDIS_TOKEN. Caching will be skipped.');
            return null;
        }
        try {
            redis = new Redis({
                url: process.env.REDIS_URL,
                token: process.env.REDIS_TOKEN,
            });
            console.log('[REDIS] Client initialized');
        } catch (error) {
            console.error('[REDIS] Initialization error:', error.message);
            return null;
        }
    }
    return redis;
};

module.exports = { getRedisClient };
