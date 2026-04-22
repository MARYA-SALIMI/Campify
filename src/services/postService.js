// Gerçek backend'e bağlanana kadar api'yi devre dışı bırakıyoruz
// import { api } from './api'; 

// Ekranda tasarımı görebilmek için oluşturduğumuz sahte (Mock) gönderiler
const MOCK_POSTS = [
  {
    _id: '1',
    title: 'Kampüste Bahar Şenliği',
    content: 'Bu hafta sonu güney kampüste bahar şenliği var, kimler geliyor? Etkinlik takvimi çok dolu!',
    author: { name: 'Ahmet Yılmaz', username: 'ahmety', avatar: 'A' },
    category: 'Etkinlik',
    createdAt: new Date().toISOString(),
    likes: 12,
    comments: 3
  },
  {
    _id: '2',
    title: 'Kütüphane Saatleri Güncellendi',
    content: 'Vize haftası yaklaştığı için kütüphane bugünden itibaren 7/24 açık olacakmış, bilginize arkadaşlar.',
    author: { name: 'Emine Çelik', username: 'eminec', avatar: 'E' },
    category: 'Duyuru',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 gün önce
    likes: 45,
    comments: 8
  },
  {
    _id: '3',
    title: 'Kayıp Eşya: Mavi Defter',
    content: 'Kafeteryada mavi kapaklı bir not defteri unuttum. İçinde tüm dönem notlarım var, bulan bana ulaşabilir mi?',
    author: { name: 'Sinem Havan', username: 'sinemhvn', avatar: 'S' },
    category: 'Kayıp/Buluntu',
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 gün önce
    likes: 5,
    comments: 1
  }
];

// Gönderileri çekme (0.5 saniye gecikme ile gerçekçi bir yükleme efekti verir)
export const getAllPosts = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_POSTS);
    }, 500);
  });
};

// Diğer fonksiyonlar şimdilik sadece konsola yazı yazsın, çökmesin
export const getPostById = async (postId) => {
  return MOCK_POSTS.find(p => p._id === postId);
};

export const createPost = async (postData) => {
  console.log("Yeni gönderi eklendi (Mock):", postData);
  return { ...postData, _id: Math.random().toString() };
};

export const updatePost = async (postId, postData) => {
  console.log("Gönderi güncellendi (Mock):", postId);
  return { ...postData, _id: postId };
};

export const deletePost = async (postId) => {
  console.log("Gönderi silindi (Mock):", postId);
  return { success: true };
};

export const likePost = async (postId) => {
  console.log("Gönderi beğenildi (Mock):", postId);
  return { success: true };
};