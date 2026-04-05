# Melisa Öztaş'ın Web Frontend Görevleri
**Domain Adresi:** [tıklayınız](https://example.com)






---

## 1. Yorum Ekleme

* **API Endpoint:** `POST /posts/{postId}/comments`
* **Görev:** Kullanıcının gönderi detay sayfasında yorum yazabilmesi için yorum giriş alanı ve gönderme akışının tasarlanması
* **UI Bileşenleri:**

  * Gönderi altında yorum input alanı / textarea
  * Kullanıcı avatarı + mini profil görünümü
  * "Yorum Yap" butonu
  * Karakter sayacı (opsiyonel)
  * Loading spinner (yorum gönderilirken)
  * Emoji veya mention desteği (opsiyonel)
* **Form Validasyonu:**

  * Boş yorum gönderilemez
  * Maksimum karakter sınırı
  * Sadece boşluklardan oluşan yorum engeli
  * Buton yalnızca geçerli içerik varsa aktif
* **Kullanıcı Deneyimi:**

  * Enter ile hızlı gönderim (Shift+Enter yeni satır)
  * Başarılı yorum sonrası input temizleme
  * Optimistic UI ile yorumun anında listede görünmesi
  * Hata durumunda toast mesajı
  * Double-click koruması
* **Teknik Detaylar:**

  * Form state management
  * API sonrası yorum listesini invalidate / refresh
  * Error handling
  * Reusable CommentInput component

---

## 2. Yorum Listeleme

* **API Endpoint:** `GET /posts/{postId}/comments`
* **Görev:** Gönderiye ait tüm yorumların tarih sırasına göre listelenmesi
* **UI Bileşenleri:**

  * Scrollable yorum listesi
  * Her yorum için avatar
  * Yazar adı + profil linki
  * Yorum metni
  * Tarih / relative time (örn: 2 dk önce)
  * Düzenle ve sil aksiyon menüsü
  * Boş durum ekranı (ilk yorumu sen yap)
* **Kullanıcı Deneyimi:**

  * Skeleton loading
  * Infinite scroll veya pagination
  * Yeni yorum geldiğinde otomatik prepend
  * Profil adına tıklayınca kullanıcı profiline gitme
* **Teknik Detaylar:**

  * Memoized comment item component
  * Date formatting utility
  * Query caching
  * Lazy rendering (çok yorum için performans)

---

## 3. Yorum Güncelleme

* **API Endpoint:** `PUT /comments/{commentId}`
* **Görev:** Kullanıcının kendi yorumunu düzenleyebilmesi için inline edit akışı
* **UI Bileşenleri:**

  * "Düzenle" dropdown aksiyonu
  * Inline textarea edit mode
  * Kaydet butonu
  * İptal butonu
  * Düzenlendi etiketi
* **Form Validasyonu:**

  * Boş içerik kaydedilemez
  * Değişiklik yoksa kaydet disabled
  * Maksimum karakter sınırı
* **Kullanıcı Deneyimi:**

  * Inline düzenleme ile sayfa yenilemeden edit
  * ESC ile iptal
  * Başarılı güncellemede "düzenlendi" etiketi
  * Hata durumunda eski yoruma rollback
* **Teknik Detaylar:**

  * Dirty state kontrolü
  * Optimistic update
  * Permission-based UI (sadece yorum sahibi görür)

---

## 4. Yorum Silme

* **API Endpoint:** `DELETE /comments/{commentId}`
* **Görev:** Kullanıcının kendi yorumunu veya gönderi sahibinin yorumu silebilmesi
* **UI Bileşenleri:**

  * Sil butonu / dropdown menu item
  * Confirmation modal
  * Danger button style
  * Loading indicator
* **Kullanıcı Deneyimi:**

  * "Bu yorumu silmek istediğinize emin misiniz?"
  * Başarılı silmede listeden anında kaldırma
  * Undo toast (opsiyonel)
  * Yetkisiz durumda butonu gizleme
* **Teknik Detaylar:**

  * Role-based conditional rendering
  * Optimistic removal
  * Error rollback

---

## 5. Sohbet Oluşturma

* **API Endpoint:** `POST /chats`
* **Görev:** Kullanıcılar arasında yeni özel mesajlaşma kanalı başlatma sayfası / modalı
* **UI Bileşenleri:**

  * Kullanıcı arama inputu
  * Kullanıcı listesi
  * Seçili kullanıcı preview
  * "Sohbet Başlat" butonu
  * Modal veya ayrı sayfa layout
* **Kullanıcı Deneyimi:**

  * Anlık kullanıcı arama
  * Kullanıcı seçince buton aktif
  * Başarılı oluşturma sonrası chat ekranına redirect
  * Aynı kullanıcıyla mevcut chat varsa oraya yönlendirme
* **Teknik Detaylar:**

  * Debounced search input
  * Routing to `/chats/{chatId}`
  * Duplicate chat prevention
  * Reusable UserSearch component

---

## 6. Mesaj Silme

* **API Endpoint:** `DELETE /messages/{messageId}`
* **Görev:** Kullanıcının gönderdiği mesajı sohbet ekranından silebilmesi
* **UI Bileşenleri:**

  * Mesaj üzerinde hover action menu
  * Sil ikonu (trash)
  * Confirmation popup
  * "Bu mesaj silindi" placeholder görünümü
* **Kullanıcı Deneyimi:**

  * Sadece gönderen kullanıcı silme aksiyonunu görür
  * Silme sonrası mesaj balonu yerine placeholder
  * Anlık UI güncelleme
  * Hata durumunda mesaj geri yükleme
* **Teknik Detaylar:**

  * Real-time state

