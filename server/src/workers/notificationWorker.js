const { getChannel } = require('../config/rabbitmq');

const startNotificationWorker = async () => {
    try {
        const channel = getChannel();
        const queue = 'campify_post_queue';

        // Kuyruğun var olduğundan emin oluyoruz (durable: true ile verilerin kaybolmamasını sağlıyoruz)
        await channel.assertQueue(queue, { durable: true });

        console.log(`[*] ${queue} kuyruğu dinleniyor. Çıkmak için CTRL+C'ye basın.`);

        // Kuyruktan mesaj tüketme (consume) işlemi
        channel.consume(queue, (msg) => {
            if (msg !== null) {
                const postData = JSON.parse(msg.content.toString());
                
                console.log(`\n🔔 Asenkron İşlem: Yeni gönderi algılandı! İlgili öğrencilere bildirim gönderme süreci başlatılıyor... (Post ID: ${postData.postId})`);
                
                // Mesajı başarıyla işlediğimizi belirtmek için onay (ack) gönderiyoruz
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error('❌ Bildirim Worker Başlatma Hatası:', error);
    }
};

module.exports = startNotificationWorker;
