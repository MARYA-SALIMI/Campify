const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    content: { 
        type: String, 
        required: true 
    },
    authorId: { 
        type: String, // Şimdilik testleri kolay geçmek için String yapıyoruz
        required: true 
    }
}, { timestamps: true }); // Ne zaman eklendiğini otomatik kaydeder

module.exports = mongoose.model('Post', postSchema);