1. **Gönderi Oluşturma**
   - **API Metodu:** `POST /posts`
   - **Açıklama:** Kullanıcının kitap ilanı, ekip arama yazısı, duyuru veya kayıp eşya bildirimi türünde gönderi oluşturmasını sağlar. 

2. **Gönderi Listeleme**
   - **API Metodu:** `GET /posts`
   - **Açıklama:** Sistemdeki tüm gönderileri tarihe göre sıralanmış biçimde listeler.

3. **Gönderi Güncelleme**
   - **API Metodu:** `PUT /posts/{postId}`
   - **Açıklama:** Kullanıcının daha önce oluşturduğu gönderinin metin içeriğini veya görsel bağlantısını güncellemesini sağlar. 

4. **Gönderi Silme**
   - **API Metodu:** `DELETE /posts/{postId}`
   - **Açıklama:** Kullanıcının yayınladığı bir gönderiyi sistemden kalıcı olarak kaldırır.

5. **Mesaj Gönderme**
   - **API Metodu:** ` POST /chats/{chatId}/messages`
   - **Açıklama:** Kullanıcının başka bir kullanıcıya özel mesaj göndermesini sağlar. 

6. **Sohbet Listeleme**
    - **API Metodu:** `GET /chats/{chatId}/messages`
    - **Açıklama:** Giriş yapmış kullanıcının belirli bir kullanıcıyla yaptığı tüm mesajlaşmaları listeler.
