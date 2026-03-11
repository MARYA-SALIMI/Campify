# Emine Türkoğlu'nun REST API Metotları

**API Test Videosu:** [Link buraya eklenecek](https://example.com)

## 1. Ekip İlanı Oluşturma
- **Endpoint:** `POST /teams`
- **Request Body:** 
  ```json
  {
    "baslik": "team123",
    "aciklama": "Ekip arkadaşı aranıyor",
    "kontenjan": "4",
    "arananYetkinlikler": "React, Javascript"
  }
  ```
- **Response:** `201 Created` - Ekip ilanı başarıyla oluşturuldu

## 2. Ekip İlanlarını Listeleme
- **Endpoint:** `GET /teams`
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Ekip ilanları başarıyla listelendi

## 3. Ekip İlanı Güncelleme
- **Endpoint:** `PUT /teams/{teamId}`
- **Path Parameters:** 
  - `teamId` (string, required) - Ekip ID'si
- **Request Body:** 
  ```json
  {
    "baslik": "team123",
    "aciklama": "Ekip arkadaşı aranıyor",
    "kontenjan": "4",
    "arananYetkinlikler": "Javascript, React"
  }
  ```
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Ekip ilanı başarıyla güncellendi

## 4. Ekip İlanı Silme
- **Endpoint:** `DELETE /teams/{teamId}`
- **Path Parameters:** 
  - `teamId` (string, required) - Ekip ID'si
- **Authentication:** Bearer Token gerekli (Yönetici yetkisi veya ekip sahibi)
- **Response:** `204 No Content` - Ekip ilanı başarıyla silindi

  
## 5. Ekibe Katılma
- **Endpoint:** `POST /teams/{teamId}/join`
- **Path Parameters:** 
  - `teamId` (string, required) - Ekip ID'si
- **Request Body:** 
  ```json
  {
    "userId": "user123 "
  }
  ```
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Ekibe başarıyla katılındı

## 6. Ekipten Ayrılma 
- **Endpoint:** `DELETE /teams/{teamId}/leave`
- **Path Parameters:** 
  - `teamId` (string, required) - Ekip ID'si
- **Authentication:** Bearer Token gerekli 
- **Response:** `200 OK` - Ekipten başarıyla ayrılındı
