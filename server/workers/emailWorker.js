const nodemailer = require('nodemailer');

async function sendWelcomeEmail(userData) {
    // Gmail için en stabil port 587'dir (STARTTLS)
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // 587 için false olmalı
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS // Buraya mutlaka App Password yazmalısın!
        },
        tls: {
            rejectUnauthorized: false // Sertifika hatalarını görmezden gelmek için
        }
    });

    try {
        console.log(`📤 Mail gönderiliyor: ${userData.userEmail}`);
        
        await transporter.sendMail({
            from: `"Campify" <${process.env.EMAIL_USER}>`,
            to: userData.userEmail, 
            subject: userData.subject || "Campify'a Hoş Geldin!",
            text: userData.content || "Kampüs ekosistemine katıldın!"
        });
        
        console.log(`📧 Mail başarıyla gönderildi: ${userData.userEmail}`);
    } catch (error) {
        // Hata durumunda mesajın neden gitmediğini detaylı görelim
        console.error("❌ Mail gönderme hatası:", error.message);
        throw error; // Hata fırlat ki mesaj 'Ack' edilmesin, tekrar denensin
    }
}