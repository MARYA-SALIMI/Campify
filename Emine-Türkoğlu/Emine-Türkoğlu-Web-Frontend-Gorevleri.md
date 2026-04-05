# Emine Türkoğlu'un Web Frontend Görevleri
**Front-end Test Videosu:** [Link buraya eklenecek](https://www.youtube.com/watch?v=H0WN188jFdo)  

**DOMAIN LİNKİ:**[TIKLAYINIZ](https://campify-frontend.onrender.com)
## 1. Ekip İlanı Oluşturma Sayfası
- **API Endpoint:** `POST /teams`
- **Görev:** Kullanıcıların yeni bir proje veya çalışma grubu için ekip ilanı oluşturabileceği arayüzün tasarımı ve implementasyonu.
- **UI Bileşenleri:**
  - Responsive kayıt formu (desktop ve mobile uyumlu)
  - Ekip Adı alanı (type="text", minimum 5 karakter zorunluluğu)
  - Açıklama input alanı (type="text")
  - Yetkinlik Seçici (Skill Tag Input)
  - Kişi Limiti(type="number", maksimum 50 kişi)
  - İlanı Yayınla Butonu (Primary button style, işlem sırasında loading state)
- **Form Validasyonu:**
  - HTML5 form validation (required, pattern attributes)
  - Real-time JS Validation
  - Yetkinlik Kontrolü
  - Buton Durumu (Tüm zorunlu alanlar geçerli değilse "Yayınla" butonu disabled olmalıdır)
- **Kullanıcı Deneyimi:**
  - Inline Validation
  - Success Notification
  - Double-Click Koruması
  - Keyboard Navigation
- **Teknik Detaylar:**
  - Framework: React/Vue/Angular veya Vanilla JS
  - Form library: React Hook Form, Formik, veya native HTML5
  - State management (form state, loading state, error state)
  - SEO optimization (meta tags, structured data)
  - Accessibility (WCAG 2.1 AA compliance)

## 2. Ekip İlanlarını Listeleme ve Filtreleme
- **API Endpoint:** `GET /teams`
- **Görev:** Sistemdeki tüm aktif ekip ilanlarının kullanıcıya kartlar halinde sunulması.
- **UI Bileşenleri:**
  -Team Card Layout
  -Kategori Filtreleri
- **Kullanıcı Deneyimi:**
  - Empty state (veri yoksa)
  - Error state (yükleme hatası durumunda retry butonu)
  - Smooth page transition 
  - Responsive grid layout
  - Print-friendly styles

## 3. Ekip İlanı Güncelleme ve Düzenleme Sayfası
- **API Endpoint:** `PUT /teams/{teamId}`
- **Görev:** İlan sahibinin mevcut ilan bilgilerini revize edebileceği düzenleme arayüzü.
- **UI Bileşenleri:**
  - Responsive düzenleme formu
  - "Kaydet" butonu (primary button, sağ üst veya form altında)
  - "İptal" butonu (secondary button, sol üst veya form altında)
  - Değişiklik yapıldığında "Kaydet" butonu aktif olur
  - Unsaved changes indicator
  - Pre-filled Form
- **Form Validasyonu:**
  - Real-time validation feedback
  - Değişiklik yoksa "Kaydet" butonu disabled
- **Kullanıcı Deneyimi:**
  - Optimistic update (kaydet butonuna basıldığında UI anında güncellenir)
  - Başarılı güncelleme sonrası success notification (toast/snackbar)
  - Hata durumunda error mesajı ve değişiklikler geri alınır
  - "İptal" butonuna basıldığında değişiklik kaybı için browser confirmation dialog
  - Beforeunload event (sayfa kapatılırken uyarı)
 
- **Teknik Detaylar:**
  - Form state management (initial values, edited values, dirty state)
  - Routing (geri dönüş, kaydetme sonrası team sayfasına dönüş)
  - Unsaved changes warning (browser navigation)
  - Form persistence (localStorage, draft saving)
  - BeforeUnload Event
  - Ownership Check

## 4. Ekip İlanı Silme Akışı
- **API Endpoint:** `DELETE /teams/{teamId}`
- **Görev:** Kullanıcının artık ihtiyaç duymadığı ilanları sistemden kaldırma süreci.
- **UI Bileşenleri:**
  - "Ekip Sil" butonu ( danger button style)
  - Modal dialog (destructive action için)
  - Son onay ekranı (uyarı mesajları ile)
  - "Emin misiniz?" confirmation dialog (çift onay mekanizması)
  - Warning icons ve visual cues
- **Kullanıcı Deneyimi:**
  - Destructive action için görsel uyarılar (kırmızı renk, warning icons)
  - Açık ve net uyarı mesajları ("Bu işlem geri alınamaz")
  - İptal seçeneği her zaman mevcut (modal close, cancel button)
  - Silme işlemi sırasında loading indicator
  - Başarılı silme sonrası yönlendirme
  - Success message gösterilmesi
- **Akış Adımları:**
  1. Team sayfasında "Ekibi Sil" butonuna tıklama
  2. İlk uyarı modal dialog'u gösterilmesi
  3. Son onay ekranı (detaylı uyarılar, checkbox confirmation)
  4. Silme işlemi gerçekleştirme
  5. Başarılı silme sonrası team sayfasına yönlendirme
- **Teknik Detaylar:**
  - Modal/Dialog component kullanımı
  - Multi-step flow yönetimi (state machine veya step-based)
  - Error handling (silme başarısız olursa)
  - Session storage ve localStorage temizleme
  - Redirect handling 
  - Browser history management
## 5. Ekibe Katılma ve Talep Gönderme
- **API Endpoint:** `POST /teams/{teamId}/join`
- **Görev:** Kullanıcıların kendilerine uygun bir ekibe dahil olma sürecinin yönetimi.
- **UI Bileşenleri:**
  - "Katıl" butonu (İlan detay sayfasında belirgin aksiyon butonu)
  - Modal dialog (destructive action için)
- **Kullanıcı Deneyimi:**
  - İptal seçeneği her zaman mevcut (modal close, cancel button)
  - Başarılı katılma sonrası team sayfasına yönlendirme
  - Success message gösterilmesi
- **Akış Adımları:**
  1. Team sayfasında "Katıl" butonuna tıklama
  2. Başarılı katılma sonrası taem sayfasına yönlendirme
- **Teknik Detaylar:**
  - Modal/Dialog component kullanımı
  - Redirect handling (team sayfasına dönüş)
  - Browser history management
  - Auth Guard
  - Concurrency Handling
## 6. Ekipten Ayrılma Süreci
- **API Endpoint:** `DELETE /teams/{teamId}/leave`
- **Görev:** Kullanıcının mevcut üyeliğini sonlandırma işlemi.
- **UI Bileşenleri:**
  - "Ayrıl" butonu (team sayfasında, danger button style)
  - Modal dialog (destructive action için)
- **Kullanıcı Deneyimi:**
  - Destructive action için görsel uyarılar (kırmızı renk, warning icons)
  - Silme işlemi sırasında loading indicator
  - Başarılı silme sonrası team sayfasına yönlendirme
- **Akış Adımları:**
  1. Profil sayfasında "Ayrıl" butonuna tıklama
  2. Silme işlemi gerçekleştirme
  3. Başarılı silme sonrası team sayfasına yönlendirme
- **Teknik Detaylar:**
  - Modal/Dialog component kullanımı
  - Multi-step flow yönetimi (state machine veya step-based)
  - Error handling (silme başarısız olursa)
  - Success Toast
  - Redirect handling (team sayfasına dönüş)
  - Browser history management
