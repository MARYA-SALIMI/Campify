1. **Ekip İlanı Oluşturma**
   - **API Metodu:** `POST/teams`
   - **Açıklama:** Kullanıcının yeni bir ekip ilanı oluşturmasını sağlar. İlan; ekip adı, açıklama, aranan yetkinlikler ve gerekli diğer bilgileri içerir.

2. **Ekip İlanlarını Listeleme**
   - **API Metodu:** `GET/teams`
   - **Açıklama:** Sistemde mevcut olan ekip ilanlarını listeler. Kullanıcılar ilanları görüntüleyebilir ve kendilerine uygun ekipleri inceleyebilir.

3. **Ekip İlanı Güncelleme**
   - **API Metodu:** `PUT/teams/{teamID}`
   - **Açıklama:** Kullanıcının oluşturduğu ekip ilanını güncellemesini sağlar. İlan detayları (açıklama, yetkinlikler vb.) değiştirilebilir.

4. **Ekip İlanı Silme**
   - **API Metodu:** `DELETE/teams/{teamId}`
   - **Açıklama:** Kullanıcının oluşturduğu ekip ilanını sistemden kaldırmasını sağlar. Silinen ilan diğer kullanıcılar tarafından görüntülenemez.

5. **Ekibe Katılma**
   - **API Metodu:** `POST/teams/{teamId}/join`
   - **Açıklama:** Kullanıcının seçilen ekibe katılmasını veya katılım talebi göndermesini sağlar.

6. **Ekipten Ayrılma**
   - **API Metodu:** `DELETE/teams/{teamId}/leave`
   - **Açıklama:**  Kullanıcının üyesi olduğu ekipten ayrılmasını sağlar. Kullanıcı ekip üyeliğini sonlandırır.
