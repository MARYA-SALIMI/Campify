const Comment = require('../models/Comment');

// 1. Yorum Ekleme
exports.addComment = async (req, res) => {
    try {
        // URL'den postId'yi, body'den yorum metnini alıyoruz
        const { postId } = req.params;
        const { text } = req.body;
        
        // Kimlik doğrulama (auth) middleware'inden gelen kullanıcı ID'sini alıyoruz
        // Not: Eğer auth middleware'iniz 'req.user._id' döndürüyorsa burayı ona göre güncellemeliyiz.
        const userId = req.user.id; 

        // Yeni yorumu oluştur
        const newComment = new Comment({
            postId: postId,
            authorId: userId,
            text: text
        });

        // Veritabanına kaydet
        await newComment.save();

        // OpenAPI dokümanındaki "201 Created" dönüşünü yap
        res.status(201).json({
            message: "Yorum başarıyla oluşturuldu.",
            comment: newComment
        });

    } catch (error) {
        // OpenAPI dokümanındaki "400 Bad Request" dönüşü
        res.status(400).json({ 
            code: "BAD_REQUEST", 
            message: "Geçersiz istek. " + error.message 
        });
    }
};