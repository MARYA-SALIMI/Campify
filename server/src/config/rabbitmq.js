const amqp = require('amqplib');

let connection = null;
let channel = null;
let isConnected = false;

const QUEUES = {
  POST_EVENTS: 'post_events',
  COMMENT_EVENTS: 'comment_events',
  CHAT_EVENTS: 'chat_events',
  NOTIFICATION_EVENTS: 'notification_events',
};

const connectRabbitMQ = async () => {
  const url = process.env.RABBITMQ_URL || 'amqp://localhost:5672';

  try {
    connection = await amqp.connect(url);
    channel = await connection.createChannel();

    // Tum kuyruklari tanimla
    for (const queue of Object.values(QUEUES)) {
      await channel.assertQueue(queue, { durable: true });
    }

    isConnected = true;
    console.log('[RabbitMQ] Baglanti basarili.');

    // Baglanti kapanirsa yeniden baglan
    connection.on('close', () => {
      isConnected = false;
      console.warn('[RabbitMQ] Baglanti kapandi. 5 saniye sonra tekrar denenecek...');
      setTimeout(connectRabbitMQ, 5000);
    });

    connection.on('error', (err) => {
      isConnected = false;
      console.warn('[RabbitMQ] Baglanti hatasi:', err.message);
    });
  } catch (err) {
    isConnected = false;
    console.warn('[RabbitMQ] Baglanti basarisiz:', err.message);
    console.warn('[RabbitMQ] 5 saniye sonra tekrar denenecek...');
    setTimeout(connectRabbitMQ, 5000);
  }
};

const getChannel = () => channel;
const isRabbitMQAvailable = () => isConnected && channel !== null;

const closeRabbitMQ = async () => {
  try {
    if (channel) await channel.close();
    if (connection) await connection.close();
    isConnected = false;
    console.log('[RabbitMQ] Baglanti kapatildi.');
  } catch (err) {
    console.warn('[RabbitMQ] Kapatma hatasi:', err.message);
  }
};

module.exports = {
  connectRabbitMQ,
  getChannel,
  isRabbitMQAvailable,
  closeRabbitMQ,
  QUEUES,
};
