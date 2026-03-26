# Sinem Havan'ın REST API Metotları

**Canlı API Linki (Base URL):** `https://campify-api-l1vf.onrender.com`

---

## 1. Gönderi Oluşturma

- **Endpoint:** `POST /api/posts`
- **Açıklama:** Kullanıcının kitap ilanı, ekip arama yazısı vs. oluşturmasını sağlar.
- **Request Body:**

```json
{
  "title": "İlk Gönderim",
  "content": "Compass testini yapıyorum.",
  "tags": ["test", "campify"],
  "userId": "60d5ec49f1b2c8b1f8e4e1a2"
}
```

- **Response:** `201 Created`

```json
{
  "_id": "69c55741154d197ddf8987e9",
  "userId": "60d5ec49f1b2c8b1f8e4e1a2",
  "title": "İlk Gönderim",
  "content": "Compass testini yapıyorum.",
  "tags": ["test", "campify"],
  "createdAt": "2026-03-26T15:56:49.124Z",
  "updatedAt": "2026-03-26T15:56:49.124Z",
  "__v": 0
}
```

---

## 2. Gönderi Listeleme

- **Endpoint:** `GET /api/posts`
- **Açıklama:** Sistemdeki tüm gönderileri listeler.
- **Response:** `200 OK`

```json
[
  {
    "_id": "69c55741154d197ddf8987e9",
    "userId": "60d5ec49f1b2c8b1f8e4e1a2",
    "title": "İlk Gönderim",
    "content": "Compass testini yapıyorum.",
    "tags": ["test", "campify"]
  }
]
```

---

## 3. Gönderi Güncelleme

- **Endpoint:** `PUT /api/posts/:postId`
- **Açıklama:** Daha önce oluşturulmuş gönderinin içeriğini günceller.
- **Request Body:**

```json
{
  "title": "Güncellenmiş Başlık",
  "content": "Bu içerik güncellendi."
}
```

- **Response:** `200 OK`

```json
{
  "message": "Gönderi başarıyla güncellendi."
}
```

---

## 4. Gönderi Silme

- **Endpoint:** `DELETE /api/posts/:postId`
- **Açıklama:** Kullanıcının yayınladığı gönderiyi kalıcı olarak siler.
- **Response:** `200 OK`

```json
{
  "message": "Gönderi başarıyla silindi."
}
```

---

## 5. Mesaj Gönderme

- **Endpoint:** `POST /api/chats/:chatId/messages`
- **Açıklama:** Kullanıcının başka bir kullanıcıya özel mesaj göndermesini sağlar.
- **Request Body:**

```json
{
  "senderId": "60d5ec49f1b2c8b1f8e4e1a2",
  "text": "Merhaba, takım arkadaşı arıyor musun?"
}
```

- **Response:** `201 Created`

```json
{
  "_id": "80d66852265e208eef9098f0",
  "chatId": "chat12345",
  "senderId": "60d5ec49f1b2c8b1f8e4e1a2",
  "text": "Merhaba, takım arkadaşı arıyor musun?",
  "createdAt": "2026-03-26T16:10:22.000Z"
}
```

---

## 6. Sohbet Listeleme

- **Endpoint:** `GET /api/chats`
- **Açıklama:** Kullanıcının yaptığı tüm mesajlaşmaları listeler.
- **Response:** `200 OK`

```json
[
  {
    "_id": "chat12345",
    "participants": ["60d5ec49f1b2c8b1f8e4e1a2", "71e6fd50g2c3d9c2g9f5f2b3"],
    "lastMessage": "Merhaba, takım arkadaşı arıyor musun?"
  }
]
```
