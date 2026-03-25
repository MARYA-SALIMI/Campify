# Marya Salimi'nin REST API Metotları

**API Test Videosu:** [API Test Videosu](https://youtu.be/1lLLhhzn3CU)

## 1. Üye Olma
- **Endpoint:** `POST /auth/register`
- **Request Body:**  
```json  
{
  "email": "Mar@test.edu",
  "password": "S123!",
  "firstName": "Aisha",
  "lastName": "Salimi"
}
```
- **Response:** `201 Created`
```
  {
    "id": "69c3b199a93bf034cf636957",
    "ad": "Aisha",
    "soyad": "Salimi",
    "email": "Mar@test.edu",
    "bolum": "",
    "ilgi_alanlari": [],
    "yetenekler": []
}
```
  
## 2. Giriş Yapma
- **Endpoint:** `POST /auth/login`
- **Request Body:**
 ```json 
{
  "email": "Mar@test.edu",
  "password": "S123!"
}
  ```
- **Response:** `200 ok`
```
   {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5Yjk1ZjEyYjRmZjQzNTRlN
TkxYzc0NCIsImlhdCI6MTc3NDQzMDkwNiwiZXhwIjoxNzc0NDM0NTA2fQ.UYR8L337wV5WZypiN8BxUHgQUBzaV8PeTfMne24RZ_A",
    "expiresIn": 3600,
    "user": {
        "id": "69b95f12b4ff4354e591c744",
        "ad": "Aisha",
        "soyad": "Salimi",
        "email": "Mar@test.edu",
        "bolum": "",
        "ilgi_alanlari": [],
        "yetenekler": []
    }
}
```
  
## 3. Profil Görüntüleme
- **Endpoint:** `GET /users/{userId}`
- **Path Parameters:** 
  - `userId` (string, required) - Kullanıcı ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK`
```
{
    "id": "69b95f12b4ff4354e591c744",
    "ad": "Aisha",
    "soyad": "Salimi",
    "email": "Mar@test.edu",
    "bolum": "",
    "ilgi_alanlari": [],
    "yetenekler": []
}
```


## 4. Profil Güncelleme
- **Endpoint:** `PUT /profile`
 - **Authentication:** Bearer Token gerekli
- **Request Body:** 
```json
{
    "firstName": "Aisha",
    "lastName": "Salimi",
    "email": "Mar@test.edu",
    "interests": ["reading","writing"],
    "skills": ["swimming", "leadership"]
}
  ```
- **Response:** `200 OK` 
```
{
    "_id": "69b95f12b4ff4354e591c744",
    "firstName": "Aisha",
    "lastName": "Salimi",
    "email": "Mar@test.edu",
    "interests": [
        "reading",
        "writing"
    ],
    "skills": [
        "swimming",
        "leadership"
    ],
    "createdAt": "2026-03-17T14:02:58.250Z",
    "updatedAt": "2026-03-25T09:32:50.450Z",
    "__v": 0
}

```

## 5. Çıkış Yapma
- **Endpoint:** `POST /auth/logout`
- **Authentication:** Bearer Token gerekli
- **Response:** `200 ok`
```json
{
"message": "Çıkış başarılı"
}
```

## 6. Hesap Silme
- **Endpoint:** `DELETE /profile`
- **Authentication:** Bearer Token gerekli (kendi hesabını silme yetkisi)
- **Response:** `200 ok`
```json
{
"message": "User deleted successfully"
}
```




  
