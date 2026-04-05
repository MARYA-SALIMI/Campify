# Sinem Havan'ın Web Frontend Görevleri
**Front-end Test Videosu:** [Link buraya eklenecek](https://youtu.be/L2DXvv4ymvI?si=tYhd1KnJ_sZ2iCA1)

**Domain Linki:** [https://campify-frontend.onrender.com](https://campify-frontend.onrender.com)

---

## 1. Gönderi Oluşturma Sayfası
- **API Endpoint:** `POST /posts`
- **Görev:** Kullanıcının yeni gönderi oluşturması için Next.js tabanlı sayfa tasarımı, form validasyonu ve API entegrasyonu.
- **UI Bileşenleri:**
  - Responsive & Glassmorphism Form Container: Tailwind CSS kullanılarak her cihaza uyumlu, backdrop-blur-md (cam efekti) ve shadow-2xl ile zenginleştirilmiş modern kart tasarımı.
  - Başlık Alanı (Title Input): Kullanıcının gönderi başlığını girebileceği, odaklanıldığında çerçeve rengini anlık değiştiren (emerald-500) interaktif input alanı.
  - İçerik Alanı (Content Textarea): Gönderi içeriği için geniş, yeniden boyutlandırılabilir textarea bileşeni; boş bırakıldığında anlık hata mesajı gösterilir.
  - Kategori Seçimi: Kullanıcının gönderi kategorisini seçebileceği dropdown bileşeni.
  - Akıllı Gönder Butonu: Tüm validasyon kuralları sağlanmadan aktifleşmeyen (disabled), tıklandığında gradient (from-emerald-600 to-teal-600) renkleriyle dikkat çeken ve işlem sırasında spinner animasyonu barındıran Primary Button.
  - Tema Yönetimi (Theme Toggle): Sayfanın sağ üst köşesine entegre edilmiş, isDark state'ine bağlı olarak anlık Karanlık/Aydınlık mod geçişi sağlayan Sun/Moon butonu.
- **Form Validasyonu:**
  - Zorunlu Alan Kontrolü: Başlık ve içerik alanlarının boş bırakılması durumunda anlık hata mesajı gösterilir.
  - Real-time Feedback: onChange ve onBlur event'leri dinlenerek, kullanıcı alanı terk ettiğinde boş bırakılan yerler için anında hata fırlatılır.
  - Tüm alanlar geçerli olmadan buton disabled kalır.
- **Kullanıcı Deneyimi:**
  - Hata Animasyonları (Error Handling): Hatalı giriş yapıldığında veya API error döndürdüğünde özel animate-shake (form titreme) efekti devreye girer.
  - Başarı Durumu Yönetimi: Gönderi başarıyla oluşturulduğunda kullanıcıya onay mesajı gösterilir ve gönderi listesine yönlendirilir.
  - Görsel Zenginlik: Arka planda sabit (fixed), blur-3xl değerine sahip özel radial gradient animasyonları kullanılmıştır.
  - Keyboard navigation desteği (Enter).
- **Teknik Detaylar:**
  - Framework: Next.js (App Router, Server & Client Components).
  - State Management: useState ile form, yüklenme ve görsel durum yönetimi; Context API ile oturum ve kullanıcı verisi yönetimi.
  - Styling: Tailwind CSS utility sınıfları ile responsive ve temaya duyarlı tasarım.
  - Routing: Next.js yerleşik router ile sayfa yenilenmeden yönlendirme.

---

## 2. Gönderi Listeleme Sayfası
- **API Endpoint:** `GET /posts`
- **Görev:** Platforma ait tüm gönderilerin listelenmesi, filtrelenmesi ve kullanıcıya akıcı bir feed deneyimi sunulması.
- **UI Bileşenleri:**
  - Responsive Kart Izgarası: Masaüstünde çok kolonlu (grid), mobilde tek kolonlu akıcı kart yerleşimi. Her kart backdrop-blur-md ve shadow-xl ile glassmorphism estetiğine uygun tasarlanmıştır.
  - Gönderi Kartı (Post Card): Başlık, içerik özeti, kategori rozeti, yazar bilgisi ve tarih bilgilerini barındıran modern kart bileşeni. hover:scale-[1.02] efektiyle etkileşim hissi verilir.
  - Arama & Filtreleme Çubuğu: Kullanıcının gönderileri başlık veya kategoriye göre anlık filtreleyebildiği search input bileşeni.
  - Yüklenme Durumu (Loading State): Veri çekilirken iskelet (skeleton) kartlar veya spinner animasyonu ile bekleme deneyimi sunulur.
  - Boş Durum (Empty State): Hiç gönderi yoksa kullanıcıyı gönderi oluşturmaya yönlendiren bilgilendirme alanı.
  - Tema Yönetimi (Theme Toggle): isDark state'ine bağlı anlık Karanlık/Aydınlık mod geçişi.
- **Kullanıcı Deneyimi:**
  - Smooth Page Transitions: animate-in fade-in duration-700 sınıfları ile sayfa içerikleri yumuşak opasite geçişiyle yüklenir.
  - Görsel Zenginlik: Arka planda fixed konumlandırılmış, blur-3xl değerine sahip yeşil radial glow efekti.
  - Kart tıklandığında gönderi detay sayfasına akıcı geçiş.
- **Teknik Detaylar:**
  - Framework: Next.js (App Router).
  - Veri Çekme: useEffect ile sayfa yüklendiğinde API'dan gönderiler çekilir; Authorization: Bearer token interceptor ile otomatik eklenir.
  - State Management: useState ile liste, yüklenme ve filtreleme durumu yönetilir.
  - Styling: Tailwind CSS ile responsive grid ve kart tasarımı.

---

## 3. Gönderi Güncelleme Sayfası
- **API Endpoint:** `PUT /posts/{postId}`
- **Görev:** Kullanıcının kendi gönderilerini güncelleyebileceği, mevcut verilerle önceden dolu gelen interaktif düzenleme sayfası.
- **UI Bileşenleri:**
  - Ön Doldurmalı Form: Mevcut gönderi verileri (başlık, içerik, kategori) sayfa açılışında form alanlarına otomatik olarak yüklenir.
  - Responsive Glassmorphism Form Container: backdrop-blur-md ve shadow-2xl ile zenginleştirilmiş modern kart tasarımı.
  - Başlık & İçerik Alanları: Odaklanıldığında emerald-500 çerçeve rengi ile aktif geri bildirim sağlayan input ve textarea bileşenleri.
  - Alt İşlem Çubuğu (Footer Actions):
    - Kaydet Butonu: emerald-500 gradyanlı, işlem sırasında spinner animasyonu barındıran ana buton.
    - İptal Butonu: Değişiklikleri kaydetmeden gönderi listesine geri döndüren ikincil buton.
  - Tema Yönetimi (Theme Toggle): Anlık Karanlık/Aydınlık mod geçişi.
- **Form Validasyonu:**
  - Zorunlu Alan Kontrolü: Başlık ve içerik boş bırakılamaz; boş bırakıldığında anlık hata mesajı gösterilir.
  - Controlled Input Management: Tüm değişiklikler setForm yapısıyla anlık olarak takip edilir.
  - Değişiklik Algılama: Kullanıcı orijinal veriden farklı bir değer girmeden Kaydet butonu pasif kalır.
- **Kullanıcı Deneyimi:**
  - Akıcı Geçiş Animasyonları: Form bileşeninin slide-in-from-bottom-4 ile aşağıdan yukarıya profesyonel girişi.
  - Başarılı güncelleme sonrası kullanıcıya onay mesajı gösterilir ve gönderi listesine yönlendirilir.
  - Hata durumlarında kullanıcı dostu mesajlar gösterilir.
- **Teknik Detaylar:**
  - Framework: Next.js (Dynamic Routes: `/posts/[postId]/edit`).
  - State Management: useState ile form verileri ve yüklenme durumu yönetilir.
  - Veri Yükleme: Sayfa açılışında `GET /posts/{postId}` ile mevcut veri çekilip forma doldurulur.
  - Interceptor Entegrasyonu: Güncelleme isteği JWT token ile otomatik olarak imzalanır.
  - Styling: Tailwind CSS.

---

## 4. Gönderi Silme Akışı
- **API Endpoint:** `DELETE /posts/{postId}`
- **Görev:** Kullanıcının kendi gönderini güvenli bir şekilde silmesi için çift onaylı modal mekanizması ve silme protokolü sunmak.
- **UI Bileşenleri:**
  - Kritik Eylem Butonu (Danger Trigger): Gönderi kartı veya detay sayfasında yer alan, kırmızı temalı (text-red-500) sil butonu.
  - Onay Modalı (Confirmation Modal): fixed inset-0 ile tüm ekranı kaplayan, bg-black/70 ve backdrop-blur-sm efektiyle arka planı pasifize eden modal bileşeni.
  - Uyarı Paneli: "Bu gönderiyi silmek istediğine emin misin?" başlığı ve "Bu işlem geri alınamaz" uyarısı bulunan yüksek kontrastlı bilgi kartı.
  - Onay Butonları:
    - Vazgeç (Cancel): İşlemi güvenli şekilde iptal eden ikincil buton.
    - Sil (Confirm): bg-red-600 rengi ve shadow-red-600/20 dış ışığı ile işlemin ciddiyetini vurgulayan ana buton.
- **Kullanıcı Deneyimi:**
  - Başlatma: Kullanıcı "Sil" butonuna tıklar, onay modalı ekranın merkezinde z-50 katmanında belirir.
  - Çift Onay Mekanizması: "Vazgeç" ve "Sil" seçenekleri net hiyerarşiyle sunulur.
  - Başarılı silme sonrası gönderi listesinden kaldırılır ve kullanıcıya bildirim gösterilir.
  - Modal açıkken arka plan scroll engellenir.
- **Teknik Detaylar:**
  - Modal State Management: Boolean state ile modalin açılıp kapanması kontrol edilir.
  - Asenkron API Entegrasyonu: DELETE isteği JWT token ile otomatik olarak imzalanır.
  - Optimistic UI: Silme isteği gönderildiğinde gönderi listeden anlık kaldırılır; hata durumunda geri eklenir.
  - Error Handling: Ağ veya sunucu hataları catch blokları ile yakalanarak kullanıcıya bildirim yapılır.
  - Styling: Tailwind CSS.

---

## 5. Mesaj Gönderme Sayfası
- **API Endpoint:** `POST /messages`
- **Görev:** Kullanıcıların birbirine anlık mesaj gönderebildiği, sohbet arayüzüne entegre mesaj gönderme bileşeni.
- **UI Bileşenleri:**
  - Mesaj Giriş Alanı (Message Input): Alt kısımda sabit konumlandırılmış, geniş textarea veya input bileşeni. Enter tuşuyla gönderim desteği.
  - Gönder Butonu: emerald-500 gradyanlı, mesaj alanı boşken disabled olan, gönderim sırasında spinner animasyonu barındıran buton.
  - Mesaj Baloncukları (Message Bubbles): Gönderilen ve alınan mesajları görsel olarak ayıran, sağ/sol hizalamalı balonlar. Kendi mesajları emerald tonlarında, gelen mesajlar nötr renklerde gösterilir.
  - Zaman Damgası: Her mesaj balonunun altında küçük font ile gönderim saati.
  - Tema Yönetimi (Theme Toggle): isDark state'ine bağlı anlık Karanlık/Aydınlık mod geçişi.
- **Form Validasyonu:**
  - Boş Mesaj Engeli: Mesaj alanı boşken Gönder butonu disabled kalır, boşluk karakteri ile gönderim engellenir.
  - Maksimum Karakter Sınırı: Belirlenen karakter sınırı aşıldığında kullanıcıya uyarı gösterilir.
- **Kullanıcı Deneyimi:**
  - Mesaj gönderildikten sonra input alanı otomatik temizlenir ve sohbet alanı en alta kaydırılır (auto-scroll).
  - Gönderim sırasında mesaj optimistik olarak listeye eklenir; hata durumunda kaldırılır.
  - Görsel Zenginlik: Glassmorphism kart yapısı ve blur-3xl radial gradient arka plan.
- **Teknik Detaylar:**
  - Framework: Next.js (App Router).
  - State Management: useState ile mesaj içeriği ve yüklenme durumu yönetilir.
  - Auto-scroll: useRef ile mesaj listesinin en altına otomatik kaydırma.
  - Interceptor Entegrasyonu: POST isteği JWT token ile otomatik olarak imzalanır.
  - Styling: Tailwind CSS.

---

## 6. Sohbet Listeleme Sayfası
- **API Endpoint:** `GET /chats`
- **Görev:** Kullanıcının tüm aktif sohbetlerini listeleyen, sohbete tıklandığında mesajlaşma ekranına yönlendiren sayfa.
- **UI Bileşenleri:**
  - Sohbet Listesi Kartları: Her sohbet için karşı kullanıcının adı, son mesaj önizlemesi ve zaman damgasını gösteren tıklanabilir liste öğeleri. hover:bg-emerald-500/10 efektiyle etkileşim hissi verilir.
  - Avatar Alanı: Her sohbet kartında karşı kullanıcıya ait baş harf veya ikon tabanlı yuvarlak avatar bileşeni.
  - Okunmamış Mesaj Rozeti: Okunmamış mesaj sayısını gösteren, emerald-500 arka planlı küçük sayı rozeti.
  - Arama Çubuğu: Sohbetleri kullanıcı adına göre anlık filtreleme imkânı sunan search input.
  - Yüklenme Durumu (Loading State): Veri çekilirken iskelet (skeleton) liste öğeleri gösterilir.
  - Boş Durum (Empty State): Henüz sohbet yoksa "Henüz sohbetin yok, birine mesaj at!" yönlendirme mesajı.
  - Tema Yönetimi (Theme Toggle): isDark state'ine bağlı anlık Karanlık/Aydınlık mod geçişi.
- **Kullanıcı Deneyimi:**
  - Sohbet kartına tıklandığında ilgili mesajlaşma sayfasına akıcı geçiş.
  - Smooth Page Transitions: animate-in fade-in duration-700 ile yumuşak yükleme.
  - Görsel Zenginlik: Arka planda fixed, blur-3xl radial glow efekti.
- **Teknik Detaylar:**
  - Framework: Next.js (App Router).
  - Veri Çekme: useEffect ile sayfa yüklendiğinde tüm sohbetler API'dan çekilir.
  - State Management: useState ile sohbet listesi, yüklenme ve filtreleme durumu yönetilir.
  - Routing: Next.js router ile sohbet detay sayfasına `/chats/[chatId]` yönlendirmesi.
  - Interceptor Entegrasyonu: GET isteği JWT token ile otomatik olarak imzalanır.
  - Styling: Tailwind CSS.
