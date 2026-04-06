# Marya Salimi'nin Web Frontend Görevleri
**Front-end Test Videosu:** 

**Domain Liniki:** [https://campify-frontend.onrender.com ](https://campify-frontend.onrender.com )

## 1. Üye Olma Sayfası
- **API Endpoint:** `POST /auth/register`
- **Görev:** Kullanıcı kayıt işlemi için web sayfası tasarımı, form validasyonu ve Firebase Auth implementasyonu.
- **UI Bileşenleri:**
  - Responsive & Glassmorphism Form Container: Tailwind CSS kullanılarak her cihaza uyumlu, backdrop-blur-md (cam efekti) ve shadow-2xl ile zenginleştirilmiş modern kart  tasarımı.
  - Dinamik E-posta Alanı (Email Input): Lucide-Mail ikonu ile desteklenen, kullanıcının yalnızca kurumsal adres girmesini sağlayan özel input. Geçerli mail girildiğinde yeşil onay ikonu (CheckCircle2), geçersiz girildiğinde ise animate-pulse efektli uyarı mesajı gösterilir.
  - Gelişmiş Şifre Alanı (Password Input): Eye/EyeOff ikonları ile şifre görünürlüğünü anlık değiştirme (toggle) özelliği
  - Gerçek Zamanlı Şifre Gücü Göstergesi: 4 kademeli (Very Weak, Weak, Fair, Strong) özel bar tasarımı. Regex algoritmalarıyla şifre anlık test edilip UI üzerinden renklendirme (emerald-500) yapılır.
  - Ad ve Soyad Alanları: Odaklanıldığında (onFocus) focusedField state'ini dinleyerek ikon ve çerçeve rengini anlık değiştiren (emerald-500) interaktif input alanları
  - Akıllı Kayıt Butonu: Tüm validasyon kuralları sağlanmadan aktifleşmeyen (disabled), tıklandığında gradient (from-emerald-600 to-teal-600) renkleriyle dikkat çeken ve işlem sırasında Loader2 spinner animasyonu barındıran Primary Button.
  - Yönlendirme Linkleri: React Router DOM Link bileşeni ile sayfa yenilenmeden çalışan, optimize edilmiş "Already have an account? Sign In" geçiş alanı.
  - Tema Yönetimi (Theme Toggle): Sayfanın sağ üst köşesine entegre edilmiş, isDark state'ine bağlı olarak anlık Karanlık/Aydınlık mod geçişi sağlayan Sun/Moon butonu.
- **Form Validasyonu:**
  - Domain Kısıtlaması: useMemo hook'u kullanılarak e-posta adresinin .toLowerCase().endsWith('@ogr.sdu.edu.tr') kontrolünden geçmesi zorunlu kılınmıştır.
  - Regex Şifre Kontrolü: Şifrenin en az 8 karakter olması, büyük harf, rakam ve özel karakter içermesi validatePassword fonksiyonu ile denetlenir. (Minimum güvenlik seviyesi 3 olmadan form gönderilemez).
  - Real-time Feedback: onChange ve onBlur event'leri dinlenerek, kullanıcı alanı terk ettiğinde boş bırakılan yerler için anında Required hatası fırlatılır.
  - Tüm alanlar geçerli olmadan buton disabled
- **Kullanıcı Deneyimi:**
  - Hata Animasyonları (Error Handling): Hatalı giriş yapıldığında veya API error döndürdüğünde, inline CSS @keyframes ile yazılmış özel animate-shake (form titreme) efekti devreye girer.
  - Başarı Durumu Yönetimi: Kayıt başarılı olduğunda kullanıcıya özel tasarımlı bir onay mesajı gösterilir ve setTimeout ile 2 saniye bekletilerek akıcı bir şekilde Login sayfasına (navigate) yönlendirilir.
  - Hata durumlarında kullanıcı dostu mesajlar (409 Conflict: "Bu email zaten kullanılıyor")
  - Görsel Zenginlik: Arka planda sabit (fixed), sayfa kaydırmasından etkilenmeyen, blur-3xl değerine sahip özel radial gradient animasyonları kullanılmıştır.
  - Keyboard navigation desteği (Enter)
- **Teknik Detaylar:**
- Framework: React 18+ (Functional Components & Hooks).
- Form Library: Dış kütüphane bağımlılığı yerine, daha esnek ve hafif olan Native Controlled Components yapısı tercih edilmiştir.
- State Management: * Local State: useState ile form, yüklenme ve görsel durum yönetimi.
- Global State: Context API (AuthContext) ile oturum ve kullanıcı verisi yönetimi.
- Routing: React Router DOM v6 (Nested Routes & Protected Layout)
- Erişilebilirlik (WCAG 2.1 AA): Semantik HTML5 etiketleri, Lucide ikonları ile görsel destek ve yüksek kontrastlı Dark Mode seçeneği ile erişilebilirlik standartları gözetilmiştir.



## 2. Giriş Yapma Sayfası
- **API Endpoint:** `POST /auth/login`
- **Görev:** Mevcut kullanıcıların sisteme güvenli erişimi, JWT (JSON Web Token) oturum yönetimi ve yetkilendirme (authorization) süreçlerinin başlatılması.
- **UI Bileşenleri:**
- Premium Glassmorphism Container: backdrop-blur-xl ve shadow-2xl ile derinlik kazandırılmış, hem karanlık hem aydınlık modda (isDark) kontrast dengesi optimize edilmiş modern form kartı.
- Dinamik Motivasyon Paneli (Rotating Quotes): useEffect ve setInterval ile yönetilen, her 5 saniyede bir değişen eğitim odaklı "Campus Quotes" alanı. Kullanıcıya yaşayan bir platform deneyimi sunar.
- E-posta Giriş Alanı (Email Input): useCallback ile optimize edilmiş regex kontrolü. Geçerli format girildiğinde CheckCircle2 ikonu ile anlık onay; hatalı girişte ise kırmızı çerçeve uyarısı verilir.
- Güvenli Şifre Alanı (Password Input): Eye/EyeOff ikonları ile şifre maskeleme kontrolü. Giriş sırasında focusedField state'ini dinleyerek scale-[1.02] efektiyle odaklanma (focus) deneyimini iyileştirir.
- Erişim Butonu (Access Dashboard): Form geçerli değilken disabled olan, işlem sırasında Loader2 spinner animasyonu ile asenkron süreci (Authenticating...) görselleştiren emerald-600 gradient buton.
- Tema Değiştirici (Theme Toggle): Sayfanın sağ üst köşesinde sabitlenen, Sun/Moon ikonlarıyla tek tıkla tüm uygulama temasını (isDark) değiştiren global tema butonu
- Görsel Rozetler (Badges): Güvenlik vurgusu için Fingerprint (Secure Login) ve Shield (Encrypted Connection) ikonlu minimal rozetler.
- **Form Validasyonu:**
- Regex E-posta Denetimi: useCallback hook'u ile memoize edilmiş validateEmail fonksiyonu, standart e-posta formatını harf duyarlı olarak denetler.
- Boş Alan Kontrolü: handleSubmit aşamasında e-posta veya şifrenin boş olup olmadığı kontrol edilerek setError üzerinden kullanıcı bilgilendirilir.
- Dinamik Buton Aktivasyonu: Şifre uzunluğu ve e-posta formatı kuralları sağlanmadan butonun tıklanabilir olması engellenmiştir.
- **Kullanıcı Deneyimi:**
- Auth Guarding (Oturum Koruma): useEffect içinde isAuthenticated state'i dinlenerek, halihazırda giriş yapmış kullanıcının Login sayfasına erişimi engellenmiş ve otomatik olarak /Home dizinine yönlendirilmiştir.
- Hata Geri Bildirimi (Error Handling): Hatalı kimlik bilgilerinde veya sunucu hatalarında @keyframes shake animasyonu ile formun titremesi sağlanarak kullanıcının dikkati hataya çekilir.
- İnteraktif Arka Plan: Arka planda blur-3xl radial gradientler ve SVG grid pattern kullanılarak profesyonel bir ekosistem derinliği oluşturulmuştur.
- Navigasyon Akışı: useNavigate ile başarılı giriş sonrası /Home sayfasına replace: true parametresiyle yönlendirme yapılır (Back butonu ile formun tekrar görünmesi engellenir).
- **Teknik Detaylar:**
- Framework: React 18+ (Functional Components & Hooks).
- Form Library: Harici kütüphane yerine performans odaklı Native Controlled Components tercih edilmiştir.
- State Management: - Local State: useState (Email, password, error, loading, quotes, isDark).
- Global State: Context API (AuthContext) ile login fonksiyonu ve token yönetimi.
- Routing: React Router DOM v6 (SPA mimarisine uygun client-side routing).
- Erişilebilirlik (WCAG 2.1 AA): Semantik nav, main, footer etiketleri; ikonlar ile zenginleştirilmiş label alanları ve yüksek kontrastlı tipografi.
  

## 3. Profil Görüntüleme Sayfası
- **API Endpoint:** `GET /users/{userId}`
- **Görev:** Kullanıcı profil bilgilerini görüntüleme sayfası tasarımı ve implementasyonu
- **UI Bileşenleri:**
- Responsive Profil Layout: Masaüstünde geniş max-w-5xl konteyner yapısı; mobil cihazlarda ise flex-col ile üst üste binen (stacked) akıcı tasarım.
- Modern Avatar Alanı: linear-gradient(135deg, var(--green), var(--green-2)) geçişli çerçeve içinde, User ikonlu özelleştirilmiş placeholder avatar tasarımı.
- Hiyerarşik Başlık Yapısı (H1): Kullanıcının adı ve soyadı, text-4xl font-bold ve tracking-tight özellikleri ile sayfanın odak noktası olarak konumlandırılmıştır.
- İnteraktif Bilgi Satırları: Mail ikonu ile sunulan e-posta adresi ve Calendar ikonu ile "Katılım: [Tarih]" formatında sunulan üyelik bilgisi.
- Akademik Kimlik Rozeti: BookOpen ikonu eşliğinde kullanıcının bölümünü (Department) gösteren, var(--green-dark) arka planlı oval (pill-shaped) badge
- Yetenek & İlgi Alanları Izgarası: Award ve Heart ikonlarıyla kategorize edilmiş, her biri hover:scale-105 efektine sahip interaktif tag bileşenleri.
- Eylem Butonları: - Profili Düzenle: Edit3 ikonu barındıran, gradyan geçişli ana işlem butonu.
- Hesabı Sil: Sayfanın en altında konumlandırılmış, Trash2 ikonu ile desteklenen kırmızı temalı (text-red-500) tehlike butonu.
- **Kullanıcı Deneyimi:**
- Loading State: Veri yükleme sürecinde LoadingSpinner bileşeni; animate-spin halkası ve Sparkles ikonu ile modern bir bekleme deneyimi sunar.
- Empty State: Kullanıcının henüz bir paylaşımı yoksa "Henüz paylaşım yok. Kampüs hayatını paylaşmaya başla!" mesajı ile yönlendirme yapılır.
- Smooth Page Transitions: animate-in fade-in duration-700 sınıfları sayesinde sayfa içerikleri yumuşak bir opasite geçişiyle yüklenir.
- Görsel Zenginlik: Arka planda fixed olarak konumlandırılmış, blur-[120px] değerine sahip ve temaya göre opaklığı değişen yeşil radial glow efekti.
- Dinamik Tema Uyumu: MutationObserver ile izlenen data-theme değişikliği sayesinde, karanlık ve aydınlık modlar arasında anlık CSS değişkeni (var(--bg-main)) geçişi.
- **Teknik Detaylar:**
- Mikroservis Entegrasyonu: api (User Service) ve postApi (Post Service) olmak üzere iki farklı axios instance'ı kullanılarak veriler paralel olarak (Promise.all) çekilir.
- Global Request Interceptor: Tüm isteklere Authorization: Bearer <token> bilgisini otomatik ekleyen merkezi güvenlik katmanı.
- Data Normalization: Backend'den gelen ad, soyad, bolum gibi veriler, frontend tarafında firstName, lastName, department şeklinde normalize edilerek state yönetiminde kullanılır.
- State Management: useState ile form verileri, yüklenme durumu ve düzenleme modu (editing) yönetilir; AuthContext üzerinden kullanıcı oturum bütünlüğü korunur.
- Routing & Navigation: useNavigate ile başarılı güncellemelerden sonra veya çıkış işlemlerinde akıllı yönlendirme desteği.

## 4. Profil Düzenleme Akışı
- **API Endpoint:** `PUT /profile`
- **Görev:** Profil sayfasındaki "Profili Düzenle" butonuyla tetiklenen, kullanıcının verilerini (Ad, Soyad, Bölüm, Yetenekler, İlgi Alanları) asenkron olarak güncellemesini sağlayan interaktif düzenleme modu.
- **UI Bileşenleri & Akışı:**
- Dinamik Mod Değişimi: ProfileView üzerindeki "Profili Düzenle" butonuna tıklandığında setEditing(true) state'i ile ProfileEdit bileşenine pürüzsüz geçiş.
- Responsive Düzenleme Formu: bg-gray-800/40 backdrop-blur kart yapısı içinde, mobil uyumlu grid md:grid-cols-2 yerleşimi.
- Ön Tanımlı Input Alanları: Ad (firstName), Soyad (lastName) ve Bölüm (department) alanlarının mevcut profil verileriyle (form state) otomatik dolu gelmesi.
- Dinamik Etiket Yönetimi (Skills & Interests): Award ve Heart ikonlarıyla desteklenen, Enter tuşuyla (onKeyDown) tetiklenen yeni etiket ekleme ve X butonuyla silme mekanizması.
- Alt İşlem Çubuğu (Footer Actions): - Save Changes: Save ikonu barındıran, emerald-500 gradyanlı, formu onUpdate fonksiyonuna gönderen ana buton.
- Cancel: onCancel prop'u üzerinden setEditing(false) yaparak değişiklikleri kaydedilmeden görünüm moduna geri döndüren buton.
- **Form Validasyonu:**
- Real-time Tag Validation: handleAddTag fonksiyonu ile boş veya mükerrer (duplicate) yetenek/ilgi alanı girişi engellenir.
- Controlled Input Management: Tüm değişikliklerin setForm({ ...form, [key]: value }) yapısıyla anlık olarak takip edilmesi.
- State Senkronizasyonu: Düzenleme iptal edildiğinde (onCancel), formun orijinal profile state'ine geri döndürülmesi.
- **Kullanıcı Deneyimi:**
- Akıcı Geçiş Animasyonları: ProfileEdit bileşeninin animate-in slide-in-from-bottom-4 sınıfı ile aşağıdan yukarıya doğru profesyonel bir giriş yapması.
- Görsel Bildirimler: Yetenek ve ilgi alanları eklenirken/silinirken transition-all ile sağlanan yumuşak görsel değişimler.
- Optimistic Feedback: Kullanıcı "Save Changes" dediğinde, API yanıtı beklenirken AuthContext üzerinden kullanıcıya hızlı bir güncelleme hissi verilmesi.
- **Teknik Detaylar:**
- State Management: Profile.js (Parent) seviyesinde yönetilen editing state'i ile iki farklı görünümün (ProfileView / ProfileEdit) koşullu render (conditional rendering) edilmesi.
- Prop Drilling Engelleme: form, isDark ve onUpdate gibi kritik verilerin alt bileşene temiz bir şekilde aktarılması.
- Interceptor Entegrasyonu: Güncelleme isteğinin api.js interceptor'ı sayesinde güncel JWT token ile otomatik olarak imzalanması.
- Array Operation Logic: Yeteneklerin ve ilgi alanlarının filter ve spread operatörleri ile immutability (değişmezlik) prensibine uygun yönetilmesi.


  ## 5. Çıkış Yapma Akışı
- **API Endpoint:** `POST /auth/logout`
- **Görev:** Kullanıcının aktif oturumunu güvenli bir şekilde sonlandırmak, yerel depolamadaki (Local Storage) kimlik doğrulama verilerini temizlemek ve yetkisiz erişimi engellemek için kullanıcıyı giriş sayfasına yönlendirmek.
- **UI Bileşenleri:**
- Navigasyon Çıkış Butonu: Sayfanın üst barında (nav) yer alan, LogOut ikonu ile görselleştirilmiş, bg-red-500/10 arka planı ve text-red-500 rengiyle dikkat çeken hızlı erişim butonu.
- Yükleme Göstergesi (Loading State): Çıkış işlemi tetiklendiğinde setLoading(true) ile devreye giren ve kullanıcıya işlemin sürdüğünü bildiren LoadingSpinner bileşeni.
- Görsel Geri Bildirim: Butonun hover:bg-red-500/20 özelliğiyle kullanıcıya tıklama etkileşimi (feedback) sağlanması.
- **Kullanıcı Deneyimi:**
- Tetikleme: Kullanıcı Navbar üzerindeki "Çıkış Yap" butonuna tıklar.
- Fonksiyonel İcra: AuthContext içerisindeki logout fonksiyonu asenkron olarak çağrılır.
- Temizlik: Tarayıcı belleğindeki (localStorage/sessionStorage) token ve user objeleri anında imha edilir.
- Yönlendirme: useNavigate hook'u kullanılarak kullanıcı /login veya Karşılama (Landing) sayfasına aktarılır.
- Erişim Kısıtlaması: Çıkış sonrası tarayıcının "Geri" butonuyla profil sayfasına dönülmemesi için replace: true parametresiyle geçmiş (history) temizlenir.
- **Akış Adımları:**
  1. Profil sayfasında "Çıkış Yap" butonuna tıklama
  2. Çıkış işlemi gerçekleştirme
  6. Başarılı Çıkış yapma sonrası login sayfasına yönlendirme
- **Teknik Detaylar:**
- State Purging: Global user state'i null değerine çekilerek uygulama genelindeki tüm korumalı rotalar (protected routes) otomatik olarak erişime kapatılır.
- Interceptor Reset: api.js içindeki axios instance'larının artık geçersiz olan token'ı kullanmaması sağlanır.
- Memory Management: Uygulama içindeki geçici önbellek (cache) verileri temizlenerek bellek sızıntıları önlenir.
- Security (Güvenlik): İstemci tarafında token'ın silinmesi, sunucuya gönderilecek yetkisiz isteklerin (unauthorized requests) önündeki ilk ve en önemli barajdır.


## 6. Hesap Silme Akışı
- **API Endpoint:** `DELETE /profile`
- **Görev:** Kullanıcının tüm verilerini ve dijital ayak izini sistemden kalıcı olarak temizlemesi için yüksek güvenlikli, çok aşamalı bir onay mekanizması ve silme protokolü sunmak.
- **UI Bileşenleri:**
- Kritik Eylem Butonu (Danger Trigger): ProfileEdit formunun en alt kısmında, Trash2 ikonu ile desteklenen ve kullanıcıyı dikkatli olmaya davet eden kırmızı temalı (text-red-500) interaktif buton.
- Yıkıcı İşlem Modalı (Destructive Modal): fixed inset-0 ile tüm ekranı kaplayan, bg-black/70 ve backdrop-blur-sm efektiyle arka planı pasifize eden DeleteModal bileşeni.
- Uyarı Paneli & İkonografi: var(--bg-panel-2) ve var(--border-soft) ile tasarlanmış, içinde "Hesabı Sil?" başlığı ve "Bu işlem geri alınamaz" uyarısı bulunan yüksek kontrastlı bilgi kartı.
- Onay Butonları->Vazgeç (Cancel): bg-white/5 arka planı ile düşük görsel önceliğe sahip, işlemi güvenli bir şekilde iptal eden seçenek.
-  Onay Butonları->Sil (Confirm): bg-red-600 rengi ve shadow-red-600/20 dış ışığı ile işlemin ciddiyetini vurgulayan ana işlem butonu.
- **Kullanıcı Deneyimi (UX) & Akış Adımları**
- Başlatma: Kullanıcı profil düzenleme ekranında "Delete Account" butonuna tıklar.
- Görsel Odaklama: showDeleteModal(true) state'i tetiklenir ve ekranın merkezinde z-50 katmanında onay modalı belirir.
- Çift Onay Mekanizması: Kullanıcının bilinçli bir seçim yapması için "Vazgeç" ve "Sil" seçenekleri net bir hiyerarşiyle sunulur.
- Yıkıcı İşlemin İcrası: "Sil" butonuna tıklandığında onConfirm asenkron fonksiyonu çalışır.
- Terminal Durum: Başarılı silme sonrası kullanıcı otomatik olarak oturumdan düşürülür ve login sayfasına yönlendirilir.
- **Teknik Detaylar:**
- Modal State Management: Modalin açılıp kapanması Profile.js (Parent) seviyesindeki boolean state ile kontrol edilir.
- Asenkron API Entegrasyonu: deleteAccount fonksiyonu, api.js içindeki interceptor sayesinde kullanıcının JWT token'ını otomatik olarak kullanarak DELETE isteğini güvenli bir şekilde sunucuya iletir.
- Veri İmhası (Cleanup): İşlem başarıyla tamamlandığında localStorage üzerindeki tüm oturum verileri (token, user) kalıcı olarak temizlenir.
- Redirect & History Management: useNavigate hook'u ile kullanıcı ana sayfaya/login ekranına yönlendirilir; tarayıcı geçmişi temizlenerek "Geri" butonu ile silinen hesaba erişim engellenir.
- Error Handling: Silme işlemi sırasında oluşabilecek ağ veya sunucu hataları catch blokları ile yakalanarak kullanıcıya bilgilendirme yapılır.


