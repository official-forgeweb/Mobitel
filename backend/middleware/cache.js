// Simple in-memory API response cache
const cache = new Map();

const apiCache = (duration = 300) => {
    return (req, res, next) => {
        if (req.method !== 'GET') {
            return next();
        }
        
        const key = req.originalUrl;
        const cachedResponse = cache.get(key);
        
        if (cachedResponse && (Date.now() - cachedResponse.timestamp < duration * 1000)) {
            return res.json(cachedResponse.data);
        } else {
            const originalJson = res.json.bind(res);
            res.json = (body) => {
                res.json = originalJson; // Restore
                if (res.statusCode === 200) {
                    cache.set(key, { data: body, timestamp: Date.now() });
                }
                return originalJson(body);
            };
            next();
        }
    };
};

const clearCache = (prefix) => {
    for (const key of cache.keys()) {
        if (key.startsWith(prefix)) {
            cache.delete(key);
        }
    }
};

module.exports = { apiCache, clearCache };