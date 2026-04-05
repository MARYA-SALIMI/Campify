1. **Yorum Ekleme**
   - **API Metodu:** `POST /posts/{postId}/comments`
   - **Açıklama:** Kullanıcının bir gönderiye yorum yazmasını sağlar.

2. **Yorum Listeleme**
   - **API Metodu:** `GET /posts/{postId}/comments`
   - **Açıklama:** Bir gönderiye yapılmış tüm yorumları eklenme tarihine göre sıralı olarak listeler.Her yorum için yazar adı, profil bilgisi ve tarih döner.

3. **Yorum Güncelleme**
   - **API Metodu:** `PUT /comments/{commentId}`
   - **Açıklama:** Kullanıcının daha önce yazdığı yorumun metnini düzenlemesini sağlar. Güncelleme yalnızca yorumu yazan kullanıcı tarafından yapılabilir.

4. **Yorum Silme**
   - **API Metodu:** `DELETE /comments/{commentId}`
   - **Açıklama:** Kullanıcının yazdığı yorumu sistemden kaldırır. Yalnızca yorumu yazan kullanıcı veya gönderi sahibi bu işlemi gerçekleştirebilir.

5. **Sohbet Oluşturma**
   - **API Metodu:** `POST /chats`
   - **Açıklama:** Kullanıcılar arasında özel bir mesajlaşma kanalı açılmasını sağlar.

6. **Mesaj Silme**  
   - **API Metodu:** `DELETE /messages/{messageId}`
   - **Açıklama:** Kullanıcının gönderdiği belirli bir mesajı sohbet geçmişinden kaldırır. Bu işlem sadece mesajı gönderen kişiye yetki verir.
