require('dotenv').config(); // .env dosyasını okumak için gerekli modül
const app = require('./app');
const connectDB = require('./config/db');
const { connectRabbitMQ } = require('./config/rabbitmq');
const { connectRedis } = require('./config/redis');

// Önce veritabanına bağlanıyoruz
connectDB();

// Redis bağlantısını başlatıyoruz
connectRedis();

// RabbitMQ bağlantısını başlatıyoruz ve ardından Worker'ı çağırıyoruz
connectRabbitMQ().then(() => {
  const startNotificationWorker = require('./workers/notificationWorker');
  startNotificationWorker();
}).catch(err => console.error("RabbitMQ başlatılamadı:", err));

// .env dosyasından portu alıyoruz, bulamazsa 3000'i kullanıyor
const PORT = process.env.PORT || 3000;

// Sunucuyu dinlemeye (çalıştırmaya) başlıyoruz
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda başarıyla çalışıyor... 🌐`);
});