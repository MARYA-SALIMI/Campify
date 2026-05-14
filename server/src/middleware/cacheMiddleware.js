const { getCache, setCache } = require('../config/redis');

/**
 * Express cache middleware factory
 * Belirtilen key prefix ve TTL ile GET isteklerini cacheler
 * 
 * @param {string} keyPrefix - Cache key oneki (ornegin: 'posts', 'comments')
 * @param {number} ttlSeconds - Cache suresi (saniye)
 * @param {function} keyGenerator - Ozel key uretici (opsiyonel, req objesini alir)
 */
const cacheResponse = (keyPrefix, ttlSeconds = 60, keyGenerator = null) => {
  return async (req, res, next) => {
    try {
      // Cache key olustur
      const cacheKey = keyGenerator
        ? `${keyPrefix}:${keyGenerator(req)}`
        : `${keyPrefix}:${req.originalUrl}`;

      // Onbellekte var mi kontrol et
      const cachedData = await getCache(cacheKey);

      if (cachedData) {
        console.log(`[Cache] HIT - ${cacheKey}`);
        return res.status(200).json(cachedData);
      }

      console.log(`[Cache] MISS - ${cacheKey}`);

      // Orjinal res.json'i yakala ve cache'le
      const originalJson = res.json.bind(res);
      res.json = (data) => {
        // Sadece basarili yanitlari cachele
        if (res.statusCode >= 200 && res.statusCode < 300) {
          setCache(cacheKey, data, ttlSeconds).catch(() => {});
        }
        return originalJson(data);
      };

      next();
    } catch (err) {
      // Cache hatasi olursa devam et
      console.warn('[Cache] Middleware hatasi:', err.message);
      next();
    }
  };
};

module.exports = { cacheResponse };
