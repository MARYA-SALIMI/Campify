const express = require('express');
const amqp = require('amqplib');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Render "Hilesi" - Dummy Server
app.get('/', (req, res) => res.send('Campify Worker is Running... ✅'));

app.listen(PORT, () => {
    console.log(`🚀 Worker HTTP server running on port ${PORT}`);
});

// Mail Gönderim Fonksiyonu
async function sendWelcomeEmail(userData) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    try {
        console.log(`📤 Mail gönderiliyor: ${userData.userEmail}`);
        await transporter.sendMail({
            from: `"Campify" <${process.env.EMAIL_USER}>`,
            to: userData.userEmail,
            subject: userData.subject || "Campify'a Hoş Geldin!",
            text: userData.content || "Başarıyla katıldın."
        });
        console.log(`📧 Mail başarıyla iletildi: ${userData.userEmail}`);
    } catch (error) {
        console.error("❌ Mail Hatası:", error.message);
        throw error; 
    }
}

// RabbitMQ Dinleyici
async function startWorker() {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        const queue = 'welcome_emails';

        await channel.assertQueue(queue, { durable: true });
        console.log(`[*] ${queue} kuyruğu dinleniyor...`);

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                try {
                    const userData = JSON.parse(msg.content.toString());
                    console.log(`[x] Mesaj alındı:`, userData);
                    await sendWelcomeEmail(userData);
                    channel.ack(msg); 
                } catch (err) {
                    console.error("❌ Mesaj işleme hatası:", err.message);
                    // Hata olursa mesajı reddet ve kuyruğa geri at (opsiyonel)
                    channel.nack(msg, false, true); 
                }
            }
        });
    } catch (error) {
        console.error("❌ RabbitMQ Bağlantı Hatası:", error.message);
        // Bağlantı koparsa 5 saniye sonra tekrar dene
        setTimeout(startWorker, 5000);
    }
}

startWorker();