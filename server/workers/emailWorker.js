const amqp = require('amqplib');
const http = require('http');
require('dotenv').config();

const RABBIT_URL = process.env.RABBITMQ_URL;

async function processMessage(userData) {
    // Sunumda hocanın göreceği kısım burası
    console.log("--------------------------------------------------");
    console.log(`📩 YENİ MESAJ KUYRUKTAN ALINDI`);
    console.log(`👤 Kullanıcı: ${userData.userName}`);
    console.log(`📧 E-posta: ${userData.userEmail}`);
    console.log(`📝 İçerik: ${userData.content}`);
    console.log("--------------------------------------------------");
    
    // Burada mail gönderiliyormuş gibi 1 saniye bekletiyoruz (Görsellik için)
    return new Promise(resolve => setTimeout(resolve, 1000));
}

async function startWorker() {
    try {
        const connection = await amqp.connect(RABBIT_URL);
        const channel = await connection.createChannel();
        const queue = 'welcome_emails';

        await channel.assertQueue(queue, { durable: true });
        channel.prefetch(1); // Mesajları teker teker işle

        console.log(`[*] ${queue} kuyruğu dinleniyor. Sunuma hazır! ✅`);

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const userData = JSON.parse(msg.content.toString());
                
                // Mesajı işle (Ekrana yazdır)
                await processMessage(userData);

                // Mesajı kuyruktan başarıyla sil (Ack)
                channel.ack(msg);
                console.log(`✅ [RabbitMQ]: Mesaj başarıyla işlendi ve onaylandı (Ack).`);
            }
        });

    } catch (error) {
        console.error("❌ Hata:", error.message);
        setTimeout(startWorker, 5000);
    }
}

// Render'ın kapanmaması için basit sunucu
http.createServer((req, res) => res.end('Campify Worker - Presentation Mode Active')).listen(process.env.PORT || 10000);

startWorker();