const express = require('express');
const amqp = require('amqplib');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Render'ın "uyuyakalmaması" için minik bir server
app.get('/', (req, res) => res.send('Campify Mail Worker is Alive! ✅'));

app.listen(PORT, () => {
    console.log(`🚀 Worker dummy server running on port ${PORT}`);
});

// Mail Gönderim Fonksiyonu
async function sendWelcomeEmail(userData) {
    let transporter = nodemailer.createTransport({
        service: 'gmail', // Veya kullandığın servis
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        await transporter.sendMail({
            from: '"Campify" <no-reply@campify.com>',
            to: userData.email,
            subject: "Campify'a Hoş Geldin!",
            text: `Selam ${userData.name}, Kampüs ekosistemine başarıyla katıldın!`
        });
        console.log(`📧 Mail başarıyla gönderildi: ${userData.email}`);
    } catch (error) {
        console.error("❌ Mail gönderme hatası:", error);
    }
}

// RabbitMQ'dan Mesaj Dinleme (Consume)
async function startWorker() {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        const queue = 'welcome_emails';

        await channel.assertQueue(queue, { durable: true });
        console.log(`[*] ${queue} kuyruğu dinleniyor...`);

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const userData = JSON.parse(msg.content.toString());
                console.log(`[x] Mesaj alındı:`, userData);
                
                await sendWelcomeEmail(userData);
                
                channel.ack(msg); // Mesajı kuyruktan sil
            }
        });
    } catch (error) {
        console.error("❌ Worker RabbitMQ Hatası:", error);
    }
}

startWorker();