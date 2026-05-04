const redis = require('redis');

const redisClient = redis.createClient({
  url: process.env.REDIS_URL
});

redisClient.on('connect', () => {
  console.log('✅ Redis bağlantısı başarılı');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis Bağlantı Hatası:', err);
});

const connectRedis = async () => {
  try {
    if (!process.env.REDIS_URL) {
      console.warn('⚠️ REDIS_URL tanımlanmamış, Redis başlatılmıyor.');
      return;
    }
    await redisClient.connect();
  } catch (err) {
    console.error('❌ Redis başlatılamadı:', err.message);
  }
};

module.exports = {
  redisClient,
  connectRedis
};
