const { Resend } = require('resend');
const amqp = require('amqplib');
require('dotenv').config();

// Hata ayıklama için: Değişkenlerin gelip gelmediğini kontrol et
console.log("🔍 Kontrol: RESEND_API_KEY var mı?", process.env.RESEND_API_KEY ? "Evet ✅" : "Hayır ❌");
console.log("🔍 Kontrol: RABBITMQ_URL var mı?", process.env.RABBITMQ_URL ? "Evet ✅" : "Hayır ❌");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendWelcomeEmail(userData) {
    try {
        console.log(`📤 Mail gönderiliyor: ${userData.userEmail}`);
        await resend.emails.send({
            from: 'Campify <onboarding@resend.dev>',
            to: userData.userEmail,
            subject: userData.subject || "Campify'a Hoş Geldin!",
            html: `<strong>Selam ${userData.userName}!</strong><p>${userData.content}</p>`
        });
        console.log(`📧 Mail başarıyla iletildi: ${userData.userEmail}`);
    } catch (error) {
        console.error("❌ Mail Gönderim Hatası:", error.message);
    }
}

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
                await sendWelcomeEmail(userData);
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error("❌ Worker Başlatılamadı:", error.message);
        // Hata durumunda uygulamanın hemen kapanmaması için:
        setTimeout(startWorker, 10000); 
    }
}

// Render'ın "Port meşgul değil" hatası vermemesi için basit bir sunucu
const http = require('http');
http.createServer((req, res) => res.end('Worker is alive')).listen(process.env.PORT || 10000);

startWorker();