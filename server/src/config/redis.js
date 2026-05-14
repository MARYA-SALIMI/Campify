const Redis = require('ioredis');

let redisClient = null;
let isRedisConnected = false;

const connectRedis = () => {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

  try {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) {
          console.warn('[Redis] Baglanti denemesi basarisiz, Redis olmadan devam ediliyor.');
          return null;
        }
        return Math.min(times * 200, 2000);
      },
      lazyConnect: true,
    });

    redisClient.on('connect', () => {
      isRedisConnected = true;
      console.log('[Redis] Baglanti basarili.');
    });

    redisClient.on('error', (err) => {
      isRedisConnected = false;
      console.warn('[Redis] Hata:', err.message);
    });

    redisClient.on('close', () => {
      isRedisConnected = false;
      console.warn('[Redis] Baglanti kapandi.');
    });

    redisClient.connect().catch((err) => {
      console.warn('[Redis] Ilk baglanti basarisiz:', err.message);
      isRedisConnected = false;
    });
  } catch (err) {
    console.warn('[Redis] Baslatilamadi:', err.message);
    isRedisConnected = false;
  }

  return redisClient;
};

const getRedisClient = () => redisClient;
const isRedisAvailable = () => isRedisConnected && redisClient !== null;

const getCache = async (key) => {
  if (!isRedisAvailable()) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.warn('[Redis] Cache okuma hatasi:', err.message);
    return null;
  }
};

const setCache = async (key, data, ttlSeconds = 60) => {
  if (!isRedisAvailable()) return;
  try {
    await redisClient.setex(key, ttlSeconds, JSON.stringify(data));
  } catch (err) {
    console.warn('[Redis] Cache yazma hatasi:', err.message);
  }
};

const deleteCache = async (pattern) => {
  if (!isRedisAvailable()) return;
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(...keys);
      console.log(`[Redis] ${keys.length} cache key silindi: ${pattern}`);
    }
  } catch (err) {
    console.warn('[Redis] Cache silme hatasi:', err.message);
  }
};

module.exports = {
  connectRedis,
  getRedisClient,
  isRedisAvailable,
  getCache,
  setCache,
  deleteCache,
};
