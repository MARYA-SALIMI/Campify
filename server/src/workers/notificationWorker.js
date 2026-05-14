/**
 * Notification Worker
 * RabbitMQ kuyruklarini dinleyen bagimsiz bir worker process
 * 
 * Calistirmak icin: node src/workers/notificationWorker.js
 */

const { connectRabbitMQ, getChannel, QUEUES } = require('../config/rabbitmq');

// Event handler'lari
const handlePostEvent = (event) => {
  console.log('====================================');
  console.log('[Bildirim] Yeni Post Event:');
  console.log(`  Tip: ${event.type}`);
  console.log(`  Post: ${event.data.title}`);
  console.log(`  Yazar: ${event.data.authorName}`);
  console.log(`  Zaman: ${event.timestamp}`);
  console.log('====================================');
};

const handleCommentEvent = (event) => {
  console.log('====================================');
  console.log('[Bildirim] Yeni Yorum Event:');
  console.log(`  Tip: ${event.type}`);
  console.log(`  Yorum: ${event.data.text}`);
  console.log(`  Yazar: ${event.data.authorName}`);
  console.log(`  Post ID: ${event.data.postId}`);
  console.log(`  Zaman: ${event.timestamp}`);
  console.log('====================================');
};

const handleChatEvent = (event) => {
  console.log('====================================');
  console.log('[Bildirim] Yeni Chat Event:');
  console.log(`  Tip: ${event.type}`);
  console.log(`  Mesaj: ${event.data.text}`);
  console.log(`  Gonderen: ${event.data.from}`);
  console.log(`  Oda: ${event.data.chatId}`);
  console.log(`  Zaman: ${event.timestamp}`);
  console.log('====================================');
};

const handleNotificationEvent = (event) => {
  console.log('====================================');
  console.log('[Bildirim] Push Notification:');
  console.log(`  Kullanici: ${event.data.userId}`);
  console.log(`  Baslik: ${event.data.title}`);
  console.log(`  Icerik: ${event.data.body}`);
  console.log(`  Zaman: ${event.timestamp}`);
  console.log('====================================');
};

// Bir kuyruktaki mesajlari dinlemeye basla
const consumeQueue = (queueName, handler) => {
  const channel = getChannel();
  if (!channel) {
    console.error(`[Worker] Channel bulunamadi, ${queueName} dinlenemiyor.`);
    return;
  }

  channel.consume(queueName, (msg) => {
    if (msg) {
      try {
        const event = JSON.parse(msg.content.toString());
        handler(event);
        channel.ack(msg); // Mesaji onayla (kuyruktan sil)
      } catch (err) {
        console.error(`[Worker] Mesaj isleme hatasi (${queueName}):`, err.message);
        channel.nack(msg, false, false); // Hatali mesaji at
      }
    }
  });

  console.log(`[Worker] ${queueName} kuyruugu dinleniyor...`);
};

// Worker'i baslat
const startWorker = async () => {
  console.log('==========================================');
  console.log('  Campify Notification Worker Baslatiliyor');
  console.log('==========================================');

  await connectRabbitMQ();

  // Biraz bekle ki baglanti kurulsun
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const channel = getChannel();
  if (!channel) {
    console.error('[Worker] RabbitMQ baglanamadi. Worker durduruluyor.');
    process.exit(1);
  }

  // Her kuyruk icin consumer baslat
  consumeQueue(QUEUES.POST_EVENTS, handlePostEvent);
  consumeQueue(QUEUES.COMMENT_EVENTS, handleCommentEvent);
  consumeQueue(QUEUES.CHAT_EVENTS, handleChatEvent);
  consumeQueue(QUEUES.NOTIFICATION_EVENTS, handleNotificationEvent);

  console.log('[Worker] Tum kuyruklar dinleniyor. Cikis icin Ctrl+C.');
};

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n[Worker] Kapatiliyor...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n[Worker] Kapatiliyor...');
  process.exit(0);
});

startWorker();
