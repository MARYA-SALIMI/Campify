const { Resend } = require('resend');
require('dotenv').config();

// Buradaki anahtarı Render Dashboard'a ekleyeceğiz
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendWelcomeEmail(userData) {
    try {
        console.log(`📤 Resend API üzerinden mail gönderiliyor: ${userData.userEmail}`);
        
        const { data, error } = await resend.emails.send({
            from: 'Campify <onboarding@resend.dev>', // Başlangıç için bu adres kalmalı
            to: userData.userEmail,
            subject: userData.subject || "Campify'a Hoş Geldin!",
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h2>Selam ${userData.userName || 'Marya'}! 👋</h2>
                    <p>${userData.content || 'Kampüs ekosistemine başarıyla katıldın.'}</p>
                    <hr />
                    <small>Campify Digital Campus Ecosystem</small>
                </div>
            `
        });

        if (error) {
            console.error("❌ Resend Hatası:", error.message);
            throw error;
        }

        console.log(`📧 Mail başarıyla kutuya düştü! ID: ${data.id}`);
    } catch (error) {
        console.error("❌ Genel Hata:", error.message);
        throw error;
    }
}