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

## 3. Profil Görüntüleme
- **Endpoint:** `GET /users/{userId}`
- **Path Parameters:** 
  - `userId` (string, required) - Kullanıcı ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK`



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
## 5. Çıkış Yapma
- **Endpoint:** `POST /auth/logout`

- **Authentication:** Bearer Token gerekli
- **Response:** `200 ok`
- {"message": "Çıkış başarılı"}

## 6. Hesap Silme
- **Endpoint:** `DELETE /profile`
- **Authentication:** Bearer Token gerekli (kendi hesabını silme yetkisi)
- **Response:** `200 ok`
- {
    "message": "User deleted successfully"
}



  
