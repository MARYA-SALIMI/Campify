# Sinem Havan'ın REST API Metotları
**API Test Videosu:** [Tıklayınız](https://youtu.be/4EXKfo3tEKs?si=d-r81CgxBREt7PCA)  
**Domain Adresi:** [https://campify-api-l1vf.onrender.com/](https://campify-api-l1vf.onrender.com/)

## 1. Gönderi Oluşturma
- **Endpoint:** `POST /posts`
- **Authentication:** Bearer Token gerekli
- **Request Body:** 
```json
  {
    "baslik": "post123",
    "icerik": "Gönderi içeriği buraya gelecek",
    "kategori": "Genel"
  }
```
- **Response:** `201 Created` - Gönderi başarıyla oluşturuldu

## 2. Gönderi Listeleme
- **Endpoint:** `GET /posts`
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Gönderiler başarıyla listelendi

## 3. Gönderi Güncelleme
- **Endpoint:** `PUT /posts/{postId}`
- **Path Parameters:** 
  - `postId` (string, required) - Gönderi ID'si
- **Request Body:** 
```json
  {
    "baslik": "post123",
    "icerik": "Güncellenmiş gönderi içeriği",
    "kategori": "Genel"
  }
```
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Gönderi başarıyla güncellendi

## 4. Gönderi Silme
- **Endpoint:** `DELETE /posts/{postId}`
- **Path Parameters:** 
  - `postId` (string, required) - Gönderi ID'si
- **Authentication:** Bearer Token gerekli (Yönetici yetkisi veya gönderi sahibi)
- **Response:** `204 No Content` - Gönderi başarıyla silindi

## 5. Mesaj Gönderme
- **Endpoint:** `POST /messages`
- **Authentication:** Bearer Token gerekli
- **Request Body:** 
```json
  {
    "aliciId": "user123",
    "icerik": "Merhaba, nasılsın?"
  }
```
- **Response:** `201 Created` - Mesaj başarıyla gönderildi

## 6. Sohbet Listeleme
- **Endpoint:** `GET /chats`
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Sohbetler başarıyla listelendi
