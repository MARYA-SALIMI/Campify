# Sinem Havan'ın REST API Metotları

**Canlı API Linki (Base URL):** `https://campify-api-l1vf.onrender.com`

---

## 1. Yeni Gönderi Oluşturma

- **Endpoint:** `POST /api/posts`
- **Request Body:**

```json
{
  "title": "İlk Gönderim",
  "content": "Compass testini yapıyorum.",
  "tags": ["test", "campify"],
  "userId": "60d5ec49f1b2c8b1f8e4e1a2"
}
Response: 201 Created
{
  "_id": "69c55741154d197ddf8987e9",
  "userId": "60d5ec49f1b2c8b1f8e4e1a2",
  "title": "İlk Gönderim",
  "content": "Compass testini yapıyorum.",
  "tags": [
    "test",
    "campify"
  ],
  "createdAt": "2026-03-26T15:56:49.124Z",
  "updatedAt": "2026-03-26T15:56:49.124Z",
  "__v": 0
}
2. Tüm Gönderileri Listeleme
Endpoint: GET /api/posts

Response: 200 OK
[
  {
    "_id": "69c55741154d197ddf8987e9",
    "userId": "60d5ec49f1b2c8b1f8e4e1a2",
    "title": "İlk Gönderim",
    "content": "Compass testini yapıyorum.",
    "tags": [
      "test",
      "campify"
    ],
    "createdAt": "2026-03-26T15:56:49.124Z",
    "updatedAt": "2026-03-26T15:56:49.124Z",
    "__v": 0
  }
]
3. Gönderi Silme
Endpoint: DELETE /api/posts/:id

Response: 200 OK
{
  "message": "Gönderi başarıyla silindi"
}
4. Yeni Mesaj Gönderme
Endpoint: POST /api/messages

Request Body:
{
  "senderId": "60d5ec49f1b2c8b1f8e4e1a2",
  "receiverId": "71e6fd50g2c3d9c2g9f5f2b3",
  "text": "Merhaba, naber?"
}
{
  "senderId": "60d5ec49f1b2c8b1f8e4e1a2",
  "receiverId": "71e6fd50g2c3d9c2g9f5f2b3",
  "text": "Merhaba, naber?"
}
Response: 201 Created
{
  "_id": "80d66852265e208eef9098f0",
  "senderId": "60d5ec49f1b2c8b1f8e4e1a2",
  "receiverId": "71e6fd50g2c3d9c2g9f5f2b3",
  "text": "Merhaba, naber?",
  "createdAt": "2026-03-26T16:10:22.000Z",
  "updatedAt": "2026-03-26T16:10:22.000Z",
  "__v": 0
}








































