1. **Üye Olma**
   - **API Metodu:** `POST /auth/register`
   - **Açıklama:** Kullanıcının ad, soyad, üniversite e-posta adresi ve şifre bilgilerini girerek hesap oluşturmasını sağlar. Kayıt işlemi yalnızca üniversite uzantılı e-posta adresleri için gerçekleştirilir. Girilen bilgiler kaydedilir.

2. **Giriş Yapma**
   - **API Metodu:** `POST /auth/login`
   - **Açıklama:** Kullanıcının e-posta ve şifre bilgilerini girerek hesabına erişmesini sağlar. Bilgiler doğru ise kullanıcı sisteme alınır.

3. **Çıkış Yapma**
   - **API Metodu:** `POST /auth/logout`
   - **Açıklama:** Kullanıcının aktif oturumunu sonlandırmasını sağlar. Kullanıcı sistemden çıkarılır.
     
4. **Profil Görüntüleme**
   - **API Metodu:** `GET /users/{userId}`
   - **Açıklama:** Kullanıcının sistemde kayıtlı profil bilgilerini ekranda göstermesini sağlar. Profil bilgileri; ad, soyad, bölüm, ilgi alanları ve yeteneklerden oluşur. Kullanıcılar kendi profillerini görüntüleyebilir ve sistemdeki diğer kullanıcıların profillerine erişebilir.

5. **Profil Güncelleme**
   - **API Metodu:** `PUT /profile`
   - **Açıklama:** Kullanıcı, ad, soyad, bölüm, ilgi alanları ve yetenek bilgilerini güncelleyebilir. Yapılan değişiklikler veritabanına kaydedilir. Güncelleme işlemi için kullanıcıların sisteme giriş yapmış olması gerekir ve kullanıcılar yalnızca kendi profil bilgilerini güncelleyebilir.

6. **Hesap Silme**
   - **API Metodu:** `DELETE /profile `
   - **Açıklama:** Kullanıcının hesabını sistemden kalıcı olarak silmesini sağlar. Kullanıcı hesabını kapatmak istediğinde kullanılır. Bu işlem geri alınamaz ve kullanıcının tüm verileri silinir.
