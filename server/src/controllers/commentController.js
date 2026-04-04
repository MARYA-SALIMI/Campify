

const Comment = require('../models/Comment');
const mongoose = require('mongoose');


// 1. Ekleme
exports.addComment = async (req, res) => {
    try {
        const newComment = new Comment({ 
            postId: req.params.postId, 
            text: req.body.text,
            authorId: req.body.authorId // İŞTE GÖZDEN KAÇAN O SİHİRLİ SATIR! 🚀
        });
        await newComment.save();
        res.status(201).json(newComment);
    } catch (err) { 
        res.status(400).json(err); 
    }
};

// 2. Listeleme
exports.listComments = async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId });
        res.status(200).json(comments);
    } catch (err) { res.status(500).json(err); }
};

// 3. Güncelleme (Hata Ayıklama Modu)
exports.updateComment = async (req, res) => {
    try {
        // Vercel loglarında iz sürmek için bu satırlar kritik:
        console.log("Bağlı olunan DB:", mongoose.connection.name);
        console.log("Gelen ID:", req.params.commentId);
        console.log("Gelen Veri:", req.body);

        const updated = await Comment.findByIdAndUpdate(
            req.params.commentId.trim(), // Görünmez boşlukları temizler
            { text: req.body.text }, 
            { new: true, runValidators: true }
        );
        
        if (!updated) {
            console.log("HATA: Veritabanında bu ID ile eşleşen kayıt bulunamadı.");
            return res.status(404).json({ 
                error: "Yorum bulunamadı.",
                detay: "Veritabanında " + req.params.commentId + " ID'li bir kayıt yok." 
            });
        }

        console.log("BAŞARI: Yorum güncellendi.");
        res.status(200).json(updated);

    } catch (err) { 
        console.error("GÜNCELLEME HATASI:", err.message);
        res.status(400).json({ 
            error: "Güncelleme başarısız.", 
            mesaj: err.message 
        }); 
    }
};

// 4. Silme
exports.deleteComment = async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(204).send();
    } catch (err) { res.status(400).json(err); }
};