# Ali Tutar'ın REST API Metotları

**API Test Videosu:** https://youtu.be/mz4toZTekyo  

**Domain Adresi:** https://campify-melisa.vercel.app/
## 1. Yorum Ekleme
- **Endpoint:** `POST /posts/{postId}/comments`
- **Path Parameters:** - `postId` (string, required) - Yorum yapılacak gönderinin ID'si
- **Request Body:**
  ```json
  {
  "text": "Harika bir paylaşım olmuş, emeğinize sağlık!",
  "authorId": "69c30b8dd606814fdd06840b"
  }
  ```
- **Authentication:** Bearer Token gerekli
- **Response:** `201 Created` - Yorum başarıyla eklendi

## 2. Yorum Listeleme
- **Endpoint:** `GET /posts/{postId}/comments`
- **Path Parameters:** - `postId` (string, required) - Yorumları listelenecek gönderinin ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Yorumlar başarıyla getirildi

## 3. Yorum Güncelleme
- **Endpoint:** `PUT /comments/{commentId}`
- **Path Parameters:** - `commentId` (string, required) - Güncellenecek yorumun ID'si
- **Request Body:**
  ```json
  {
    "text": "Bu yorumu güncelledim, her şey harika!"
  }
  ```
- **Authentication:** Bearer Token gerekli (Yalnızca yorumu yazan kullanıcı)
- **Response:** `200 OK` - Yorum başarıyla güncellendi

## 4. Yorum Silme
- **Endpoint:** `DELETE /comments/{commentId}`
- **Path Parameters:** - `commentId` (string, required) - Silinecek yorumun ID'si
- **Authentication:** Bearer Token gerekli (Yalnızca yorumu yazan kullanıcı veya gönderi sahibi)
- **Response:** `204 No Content` - Yorum başarıyla silindi

## 5. Sohbet Oluşturma
- **Endpoint:** `POST /chats`
- **Request Body:**
  ```json
  {
    
  "chatId": "65f1a2b3c4d5e6f7g8h9i0j1",
  "text": "Merhaba, bu bir test mesajıdır",
  "from": "kullanici_id_buraya"

  }
  ```
- **Authentication:** Bearer Token gerekli
- **Response:** `201 Created` - Sohbet başarıyla oluşturuldu

## 6. Mesaj Silme
- **Endpoint:** `DELETE /messages/{messageId}`
- **Path Parameters:** - `messageId` (string, required) - Silinecek mesajın ID'si
- **Authentication:** Bearer Token gerekli (Yalnızca mesajı gönderen kullanıcı)
- **Response:** `204 No Content` - Mesaj başarıyla silindi
