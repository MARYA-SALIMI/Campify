const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://queue:5672'; 

async function sendToQueue(queueName, data) {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), { persistent: true });

    console.log(`📥 [MQ] Mesaj ${queueName} kuyruğuna gönderildi.`);
    
    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error("❌ RabbitMQ Hatası:", error);
  }
}

module.exports = { sendToQueue };