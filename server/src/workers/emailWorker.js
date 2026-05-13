const amqp = require('amqplib');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Mail gönderici ayarları
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function startWorker() {
    try {
        // RabbitMQ'ya bağlan
        const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://queue:5672');
        const channel = await connection.createChannel();

        const queueName = 'welcome_emails';
        await channel.assertQueue(queueName, { durable: true });

        console.log(`📧 [WORKER] ${queueName} kuyruğu dinleniyor...`);

        // Kuyruktan mesajları çek
        channel.consume(queueName, async (msg) => {
            if (msg !== null) {
                const data = JSON.parse(msg.content.toString());
                
                // Controller'dan gelen "userEmail" ve "userName" alanlarını alıyoruz
                const targetEmail = data.userEmail;
                const targetName = data.userName || 'Kullanıcı';

                console.log(`📩 Yeni mail isteği alındı: ${targetEmail}`);

                try {
                    // Maili gönder
                    await transporter.sendMail({
                        from: `"Campify Ekibi" <${process.env.EMAIL_USER}>`,
                        to: targetEmail,
                        subject: data.subject || "Campify'a Hoş Geldin!",
                        text: data.content || `Merhaba ${targetName}, Campify dünyasına hoş geldin!`,
                    });

                    console.log(`✅ Mail başarıyla gönderildi: ${targetEmail}`);
                    channel.ack(msg); // Mesajın işlendiğini onayla
                } catch (err) {
                    console.error("❌ Mail gönderilirken hata oluştu:", err);
                    // Hata olursa mesajı onaylama (nack), RabbitMQ tekrar deneyecektir
                }
            }
        });
    } catch (error) {
        console.error("❌ Worker başlatılamadı:", error);
    }
}

startWorker();