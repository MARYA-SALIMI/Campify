# API Tasarımı - OpenAPI Specification Örneği

**OpenAPI Spesifikasyon Dosyası:** [CampifyAPI.yaml](CampifyAPI.yaml)

Bu doküman, OpenAPI Specification (OAS) 3.0 standardına göre hazırlanmış örnek bir API tasarımını içermektedir.

## OpenAPI Specification

```yaml
openapi: 3.0.3
info:
  title: Campify API
  description: |
    Üniversite öğrencileri için etkileşim, içerik paylaşımı, proje iş birliği ve mesajlaşmayı tek bir dijital kampüs platformunda birleştiren RESTful API.

    ## Özellikler
    - Kullanıcı hesap ve profil yönetimi
    - JWT tabanlı güvenli kimlik doğrulama
    - Gönderi oluşturma ve içerik paylaşımı
    - Kampüs içi özel mesajlaşma ve sohbet altyapısı
    - Proje ekip ilanı oluşturma ve ekip yönetimi
    - Yorum sistemi ile etkileşim artırma
    - Veri odaklı eşleştirme ve iş birliği destek mekanizmaları

    Bu API dokümantasyonu, Campify platformunun tüm akademik ve sosyal etkileşim servislerini kapsamaktadır.
  version: 1.0.0
  contact:
    name: Campify API Support Team
    email: support@campify.edu.tr

servers:
  - url: https://api.campify.edu.tr/v1
    description: Production server
  - url: https://staging-api.campify.edu.tr/v1
    description: Staging server
  - url: http://localhost:3000/v1
    description: Development server

tags:
  - name: auth
    description: Kimlik doğrulama işlemleri
  - name: users
    description: Kullanıcı ve profil işlemleri
  - name: Gönderiler
    description: Gönderi oluşturma, listeleme, güncelleme ve silme işlemleri
  - name: Mesajlar
    description: Mesaj gönderme ve sohbet listeleme işlemleri
  - name: Ekip İlanları
    description: Ekip ilanı oluşturma, listeleme, güncelleme, silme ve ekibe katılma/ayrılma işlemleri
  - name: Yorumlar
    description: Gönderilere yapılan yorum işlemleri (ekleme, listeleme, güncelleme, silme)
  - name: Sohbet
    description: Kullanıcılar arası özel mesajlaşma ve sohbet işlemleri

paths:
  /auth/register:
    post:
      tags:
        - auth
      summary: Yeni kullanıcı kaydı
      description: Sisteme yeni bir kullanıcı kaydeder
      operationId: registerUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/UserRegistration"
            examples:
              sampleRegistration:
                summary: Örnek kullanıcı kaydı
                value:
                  email: Maryasalimi@example.edu
                  sifre: Secure123!
                  ad: Marya
                  soyad: Salimi
      responses:
        "201":
          description: Kullanıcı başarıyla oluşturuldu
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/UserProfile"
              examples:
                sampleResponse:
                  summary: Başarılı kayıt örneği
                  value:
                    id: "123e4567-e89b-12d3-a456-426614174000"
                    ad: Marya
                    soyad: Salimi
                    email: Maryasalimi@example.edu
                    bolum: Bilgisayar Mühendisliği
                    ilgi_alanlari: ["Yapay Zeka", "Web Geliştirme"]
                    yetenekler: ["Python", "JavaScript"]
        "400":
          $ref: "#/components/responses/BadRequest"
        "409":
          description: Email zaten kullanımda
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
              examples:
                sampleConflict:
                  summary: Email çakışması
                  value:
                    code: "EMAIL_EXISTS"
                    message: "Bu email zaten kullanımda"

  /auth/login:
    post:
      tags:
        - auth
      summary: Kullanıcı girişi
      description: Email ve şifre ile giriş yapar, JWT token döner
      operationId: loginUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/LoginCredentials"
            examples:
              sampleLogin:
                summary: Örnek giriş
                value:
                  email: MaryaSalimi@example.edu
                  password: Secure123!
      responses:
        "200":
          description: Giriş başarılı
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/AuthToken"
              examples:
                sampleAuthToken:
                  summary: JWT token örneği
                  value:
                    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    expiresIn: 3600
                    user:
                      id: "123e4567-e89b-12d3-a456-426614174000"
                    ad: Marya
                    soyad: Salimi
                    email: Maryasalimi@example.edu
                    bolum: Bilgisayar Mühendisliği
                    ilgi_alanlari: ["Yapay Zeka", "Web Geliştirme"]
                    yetenekler: ["Python", "JavaScript"]

        "401":
          $ref: "#/components/responses/Unauthorized"

  /auth/logout:
    post:
      tags:
        - auth
      summary: Çıkış yapma
      description: Aktif oturumu sonlandırır
      operationId: logoutUser
      security:
        - bearerAuth: []
      responses:
        "200":
          description: Çıkış başarılı
        "401":
          $ref: "#/components/responses/Unauthorized"

  /users/{userId}:
    get:
      tags:
        - users
      summary: Profil görüntüleme
      description: Belirli bir kullanıcının profilini getirir
      operationId: getUserProfile
      security:
        - bearerAuth: []
      parameters:
        - $ref: "#/components/parameters/UserIdParam"
      responses:
        "200":
          description: Profil bilgileri
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/UserProfile"
              examples:
                sampleUserProfile:
                  summary: Örnek profil
                  value:
                    id: "123e4567-e89b-12d3-a456-426614174000"
                    ad: Marya
                    soyad: Salimi
                    email: Maryasalimi@example.edu
                    bolum: Bilgisayar Mühendisliği
                    ilgi_alanlari: ["Yapay Zeka", "Web Geliştirme"]
                    yetenekler: ["Python", "JavaScript"]
        "401":
          $ref: "#/components/responses/Unauthorized"
        "404":
          $ref: "#/components/responses/NotFound"

  /profile:
    put:
      tags:
        - users
      summary: Profil güncelleme
      description: Kullanıcı kendi profilini günceller
      operationId: updateUserProfile
      security:
        - bearerAuth: []
      parameters:
        - $ref: "#/components/parameters/UserIdParam"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/UserUpdate"
            examples:
              sampleUpdate:
                summary: Profil güncelleme örneği
                value:
                  ad: Marya
                  soyad: Salimi
                  bolum: Bilgisayar Mühendisliği
                  ilgi_alanlari: ["Makine Öğrenmesi"]
                  yetenekler: ["Python", "TensorFlow"]
      responses:
        "200":
          description: Güncelleme başarılı
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/UserProfile"
        "400":
          $ref: "#/components/responses/BadRequest"
        "401":
          $ref: "#/components/responses/Unauthorized"
        "403":
          $ref: "#/components/responses/Forbidden"
        "404":
          $ref: "#/components/responses/NotFound"

    delete:
      tags:
        - users
      summary: Hesap silme
      description: Kullanıcı hesabını kalıcı olarak siler
      operationId: deleteUserProfile
      security:
        - bearerAuth: []
      responses:
        "204":
          description: Hesap silindi
        "401":
          $ref: "#/components/responses/Unauthorized"
        "403":
          $ref: "#/components/responses/Forbidden"
        "404":
          $ref: "#/components/responses/NotFound"
  /api/posts:
    post:
      tags:
        - Gönderiler
      summary: Gönderi Oluştur
      operationId: createPost
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/PostInput"
      responses:
        "201":
          description: Gönderi başarıyla oluşturuldu
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Post"
        "400":
          description: Geçersiz istek verisi
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
        "401":
          description: Kimlik doğrulama başarısız (token eksik veya geçersiz)
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
        "403":
          description: Bu işlem için yetkiniz bulunmuyor
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"

    get:
      tags:
        - Gönderiler
      summary: Gönderileri Listele
      operationId: listPosts
      parameters:
        - name: page
          in: query
          required: false
          description: Sayfa numarası (varsayılan 1)
          schema:
            type: integer
            minimum: 1
            default: 1
          example: 1
        - name: limit
          in: query
          required: false
          description: Sayfa başına sonuç sayısı (varsayılan 10, maksimum 50)
          schema:
            type: integer
            minimum: 1
            maximum: 50
            default: 10
          example: 10
        - name: userId
          in: query
          required: false
          description: Belirli bir kullanıcıya ait gönderileri filtrele
          schema:
            type: string
          example: "user123"
      responses:
        "200":
          description: Gönderiler başarıyla listelendi
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/Post"
        "400":
          description: Geçersiz istek parametreleri
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
        "401":
          description: Kimlik doğrulama başarısız (token eksik veya geçersiz)
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
  /api/posts/{postid}:
    parameters:
      - name: postid
        in: path
        required: true
        description: Gönderinin benzersiz kimlik numarası
        schema:
          type: string
        example: "post123"

    put:
      tags:
        - Gönderiler
      summary: Gönderi Güncelle
      operationId: updatePost
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/PostInput"
      responses:
        "200":
          description: Gönderi başarıyla güncellendi
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Post"
        "400":
          description: Geçersiz istek verisi
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
        "401":
          description: Kimlik doğrulama başarısız (token eksik veya geçersiz)
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
        "403":
          description: Bu işlem için yetkiniz bulunmuyor
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
        "404":
          description: Gönderi bulunamadı
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"

    delete:
      tags:
        - Gönderiler
      summary: Gönderi Sil
      operationId: deletePost
      responses:
        "204":
          description: Gönderi başarıyla silindi
        "401":
          description: Kimlik doğrulama başarısız (token eksik veya geçersiz)
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
        "403":
          description: Bu işlem için yetkiniz bulunmuyor
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
        "404":
          description: Gönderi bulunamadı
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"

  /api/chats/{chatid}/messages:
    parameters:
      - name: chatid
        in: path
        required: true
        description: Mesajın ait olduğu sohbetin kimlik numarası
        schema:
          type: string
        example: "chat123"

    get:
      tags:
        - Mesajlar
      summary: Sohbet Mesajlarını Listele
      operationId: listMessages
      parameters:
        - name: page
          in: query
          required: false
          description: Sayfa numarası (varsayılan 1)
          schema:
            type: integer
            minimum: 1
            default: 1
          example: 1
        - name: limit
          in: query
          required: false
          description: Sayfa başına sonuç sayısı (varsayılan 10, maksimum 50)
          schema:
            type: integer
            minimum: 1
            maximum: 50
            default: 10
          example: 10
      responses:
        "200":
          description: Mesajlar başarıyla listelendi
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/Message"
        "401":
          description: Kimlik doğrulama başarısız (token eksik veya geçersiz)
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
        "404":
          description: Sohbet bulunamadı
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"

    post:
      tags:
        - Mesajlar
      summary: Mesaj Gönder
      operationId: sendMessage
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/MessageInput"
      responses:
        "201":
          description: Mesaj başarıyla gönderildi
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Message"
        "400":
          description: Geçersiz istek verisi
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
        "401":
          description: Kimlik doğrulama başarısız (token eksik veya geçersiz)
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
        "404":
          description: Sohbet bulunamadı
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
  /teams:
    post:
      tags:
        - Ekip İlanları
      summary: Ekip İlanı Oluşturma
      operationId: createTeam
      description: >
        Kullanıcının yeni bir ekip ilanı oluşturmasını sağlar.
        İlan; ekip adı, açıklama, aranan yetkinlikler ve
        kontenjan gibi bilgileri içerir.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/EkipIlaniInput"
      responses:
        "201":
          description: Ekip ilanı başarıyla oluşturuldu
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/EkipIlani"
        "400":
          description: Geçersiz istek verisi
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
        "401":
          description: Kimlik doğrulama başarısız (token eksik veya geçersiz)
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"

    get:
      tags:
        - Ekip İlanları
      summary: Ekip İlanlarını Listeleme
      operationId: listTeams
      description: >
        Sistemde mevcut olan ekip ilanlarını listeler. Kullanıcılar ilanları
        görüntüleyebilir ve kendilerine uygun ekipleri inceleyebilir.
        Sayfalama (pagination) ile desteklenir.
      parameters:
        - name: page
          in: query
          required: false
          description: Sayfa numarası (varsayılan 1)
          schema:
            type: integer
            minimum: 1
            default: 1
          example: 1
        - name: limit
          in: query
          required: false
          description: Sayfa başına sonuç sayısı (varsayılan 10, maksimum 50)
          schema:
            type: integer
            minimum: 1
            maximum: 50
            default: 10
          example: 10
      responses:
        "200":
          description: Ekip ilanları başarıyla listelendi
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/EkipIlani"
        "401":
          description: Kimlik doğrulama başarısız (token eksik veya geçersiz)
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
  /teams/{teamId}:
    parameters:
      - name: teamId
        in: path
        required: true
        description: Ekip ilanının benzersiz kimlik numarası
        schema:
          type: string
        example: "team123"

    get:
      tags:
        - Ekip İlanları
      summary: Ekip İlanı Getirme
      operationId: getTeam
      description: Belirtilen ID'ye sahip ekip ilanının detaylarını getirir.
      responses:
        "200":
          description: Ekip ilanı başarıyla getirildi
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/EkipIlani"
        "401":
          description: Kimlik doğrulama başarısız (token eksik veya geçersiz)
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
        "404":
          description: Ekip ilanı bulunamadı
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"

    put:
      tags:
        - Ekip İlanları
      summary: Ekip İlanı Güncelleme
      operationId: updateTeam
      description: >
        Kullanıcının oluşturduğu ekip ilanını güncellemesini sağlar.
        Yalnızca ilanı oluşturan kullanıcı güncelleme yapabilir.
        İlan detayları (açıklama, yetkinlikler, kontenjan vb.) değiştirilebilir.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/EkipIlaniInput"
      responses:
        "200":
          description: Ekip ilanı başarıyla güncellendi
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/EkipIlani"
        "400":
          description: Geçersiz istek verisi
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
        "401":
          description: Kimlik doğrulama başarısız (token eksik veya geçersiz)
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
        "403":
          description: Bu işlem için yetkiniz bulunmuyor (sadece ilan sahibi güncelleyebilir)
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
        "404":
          description: Ekip ilanı bulunamadı
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"

    delete:
      tags:
        - Ekip İlanları
      summary: Ekip İlanı Silme
      operationId: deleteTeam
      description: >
        Kullanıcının oluşturduğu ekip ilanını sistemden kaldırır.
        Silinen ilan diğer kullanıcılar tarafından görüntülenemez.
        Yalnızca ilanı oluşturan kullanıcı silebilir.
      responses:
        "204":
          description: Ekip ilanı başarıyla silindi
        "401":
          description: Kimlik doğrulama başarısız (token eksik veya geçersiz)
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
        "403":
          description: Bu işlem için yetkiniz bulunmuyor (sadece ilan sahibi silebilir)
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
        "404":
          description: Ekip ilanı bulunamadı
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"

  /teams/{teamId}/join:
    parameters:
      - name: teamId
        in: path
        required: true
        description: Katılınmak istenen ekip ilanının benzersiz kimlik numarası
        schema:
          type: string
        example: "team123"

    post:
      tags:
        - Ekip İlanları
      summary: Ekibe Katılma
      operationId: joinTeam
      description: >
        Kullanıcının seçilen ekibe katılmasını veya katılım talebi göndermesini sağlar.
        Ekip kontenjanı doluysa katılım gerçekleşmez.
        Kullanıcı zaten üyeyse hata döner.
      responses:
        "200":
          description: Ekibe başarıyla katılındı
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/KatilimYaniti"
        "400":
          description: Kontenjan dolu veya kullanıcı zaten ekip üyesi
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
        "401":
          description: Kimlik doğrulama başarısız (token eksik veya geçersiz)
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
        "404":
          description: Ekip ilanı bulunamadı
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"

  /teams/{teamId}/leave:
    parameters:
      - name: teamId
        in: path
        required: true
        description: Ayrılmak istenen ekibin benzersiz kimlik numarası
        schema:
          type: string
        example: "team123"

    delete:
      tags:
        - Ekip İlanları
      summary: Ekipten Ayrılma
      operationId: leaveTeam
      description: >
        Kullanıcının üyesi olduğu ekipten ayrılmasını sağlar.
        Kullanıcı ekip üyeliğini sonlandırır ve kontenjan güncellenir.
        İlan sahibi kendi oluşturduğu ekipten ayrılamaz.
      responses:
        "200":
          description: Ekipten başarıyla ayrılındı
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/AyrilmaYaniti"
        "400":
          description: Kullanıcı ekip üyesi değil veya ilan sahibi ayrılamaz
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
        "401":
          description: Kimlik doğrulama başarısız (token eksik veya geçersiz)
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
        "404":
          description: Ekip ilanı bulunamadı
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
  /posts/{postId}/comments:
    post:
      tags:
        - Yorumlar
      summary: Yorum Ekleme
      description: Kullanıcının bir gönderiye yorum yazmasını sağlar.
      operationId: addComment
      parameters:
        - name: postId
          in: path
          required: true
          description: Yorum yapılacak gönderinin ID değeri
          schema:
            type: integer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CommentInput"
      responses:
        "201":
          description: Yorum başarıyla oluşturuldu.
        "400":
          description: Geçersiz istek.

    get:
      tags:
        - Yorumlar
      summary: Yorum Listeleme
      description: Bir gönderiye yapılmış tüm yorumları eklenme tarihine göre listeler.
      operationId: listComments
      parameters:
        - name: postId
          in: path
          required: true
          description: Yorumları listelenecek gönderinin ID değeri
          schema:
            type: integer
      responses:
        "200":
          description: Başarılı liste dönüşü.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/Comment"

  /comments/{commentId}:
    put:
      tags:
        - Yorumlar
      summary: Yorum Güncelleme
      description: Kullanıcının yorumu düzenlemesini sağlar.
      operationId: updateComment
      parameters:
        - name: commentId
          in: path
          required: true
          description: Güncellenecek yorumun ID değeri
          schema:
            type: integer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CommentInput"
      responses:
        "200":
          description: Yorum güncellendi.
        "403":
          description: Yetkisiz işlem.

    delete:
      tags:
        - Yorumlar
      summary: Yorum Silme
      description: Kullanıcının yazdığı yorumu sistemden kaldırır.
      operationId: deleteComment
      parameters:
        - name: commentId
          in: path
          required: true
          description: Silinecek yorumun ID değeri
          schema:
            type: integer
      responses:
        "204":
          description: Yorum silindi.

  /chats:
    post:
      tags:
        - Sohbet
      summary: Sohbet Oluşturma
      description: Kullanıcılar arasında özel bir mesajlaşma kanalı açar.
      operationId: createChat
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/ChatInput"
      responses:
        "201":
          description: Sohbet kanalı oluşturuldu.

  /messages/{messageId}:
    delete:
      tags:
        - Sohbet
      summary: Mesaj Silme
      description: Belirli bir mesajı kaldırır.
      operationId: deleteMessage
      parameters:
        - name: messageId
          in: path
          required: true
          description: Silinecek mesajın ID değeri
          schema:
            type: integer
      responses:
        "204":
          description: Mesaj silindi.

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: JWT token ile kimlik doğrulama

  parameters:
    UserIdParam:
      name: userId
      in: path
      required: true
      schema:
        type: string
        format: uuid
      description: Kullanıcı benzersiz ID'si

  schemas:
    UserRegistration:
      type: object
      required:
        - email
        - password
        - firstName
        - lastName
      properties:
        email:
          type: string
          format: email
          example: "Maryasalimi@example.edu"
        password:
          type: string
          format: password
          minLength: 8
          example: "Super123@"
        firstName:
          type: string
          minLength: 2
          example: "Marya"
        lastName:
          type: string
          minLength: 2
          example: "Salimi"

    LoginCredentials:
      type: object
      required:
        - email
        - password
      properties:
        email:
          type: string
          format: email
          example: "Maryasalimi@example.edu"
        password:
          type: string
          format: password
          example: "super123!"
    AuthToken:
      type: object
      required:
        - token
        - expiresIn
        - user
      properties:
        token:
          type: string
          description: JWT access token
          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        expiresIn:
          type: integer
          description: Token geçerlilik süresi (saniye)
          example: 3600
        user:
          $ref: "#/components/schemas/UserProfile"

    UserProfile:
      type: object
      required:
        - id
        - firstName
        - lastName
        - email
      properties:
        id:
          type: string
          format: uuid
          description: Kullanıcının benzersiz kimliği
          example: "123e4567-e89b-12d3-a456-426614174000"
        firstName:
          type: string
          description: Kullanıcının adı
          example: "Marya"
        lastName:
          type: string
          description: Kullanıcının soyadı
          example: "Salimi"
        email:
          type: string
          format: email
          description: Kullanıcının e-posta adresi
          example: "Maryasalimi@example.edu"
        department:
          type: string
          description: Kullanıcının bölümü
          example: "Bilgisayar Mühendisliği"
        interests:
          type: array
          description: Kullanıcının ilgi alanları
          items:
            type: string
          example: ["Yapay Zeka", "Oyun Geliştirme"]
        skills:
          type: array
          description: Kullanıcının yetenekleri
          items:
            type: string
          example: ["Python", "JavaScript"]

    UserUpdate:
      type: object
      properties:
        firstName:
          type: string
          minLength: 2
          example: "Marya"
        lastName:
          type: string
          minLength: 2
          example: "Salimi"
        department:
          type: string
          example: "Bilgisayar Mühendisliği"
        interests:
          type: array
          description: Kullanıcının ilgi alanları
          items:
            type: string
          example: ["Yapay Zeka", "Oyun Geliştirme"]
        skills:
          type: array
          description: Kullanıcının yetenekleri
          items:
            type: string
          example: ["Python", "JavaScript"]

    Post:
      type: object
      description: Gönderi bilgilerini temsil eden model
      properties:
        _id:
          type: string
          description: Gönderinin benzersiz kimlik numarası (otomatik atanır)
          example: "post123"
        userId:
          type: string
          description: Gönderiyi oluşturan kullanıcının kimlik numarası
          example: "user123"
        title:
          type: string
          description: Gönderi başlığı
          example: "Takım arkadaşı arıyorum"
        content:
          type: string
          description: Gönderi içeriği
          example: "Unity ile mobil oyun geliştirmek istiyorum, ekibime katılacak biri var mı?"
        tags:
          type: array
          description: Gönderiye ait etiketler
          items:
            type: string
          example: ["Unity", "Mobil", "Oyun Geliştirme"]
        createdAt:
          type: string
          format: date-time
          description: Gönderinin oluşturulma tarihi (ISO 8601 formatında)
          example: "2026-02-20T14:30:00Z"
        updatedAt:
          type: string
          format: date-time
          description: Gönderinin son güncellenme tarihi (ISO 8601 formatında)
          example: "2026-02-21T10:00:00Z"
      required:
        - userId
        - title
        - content

    PostInput:
      type: object
      description: Gönderi oluşturma veya güncelleme isteği için gönderilecek veri
      properties:
        title:
          type: string
          description: Gönderi başlığı
          minLength: 3
          maxLength: 150
          example: "Takım arkadaşı arıyorum"
        content:
          type: string
          description: Gönderi içeriği
          minLength: 10
          maxLength: 2000
          example: "Unity ile mobil oyun geliştirmek istiyorum, ekibime katılacak biri var mı?"
        tags:
          type: array
          description: Gönderiye ait etiketler
          items:
            type: string
          example: ["Unity", "Mobil"]
      required:
        - title
        - content

    Chat:
      type: object
      description: Sohbet bilgilerini temsil eden model
      properties:
        _id:
          type: string
          description: Sohbetin benzersiz kimlik numarası (otomatik atanır)
          example: "chat123"
        participants:
          type: array
          description: Sohbete katılan kullanıcıların kimlik numaraları
          items:
            type: string
          example: ["user123", "user456"]
        lastMessage:
          $ref: "#/components/schemas/Message"
        createdAt:
          type: string
          format: date-time
          description: Sohbetin oluşturulma tarihi (ISO 8601 formatında)
          example: "2026-02-20T14:30:00Z"
      required:
        - participants
    Message:
      type: object
      description: Mesaj bilgilerini temsil eden model
      properties:
        _id:
          type: string
          description: Mesajın benzersiz kimlik numarası (otomatik atanır)
          example: "msg789"
        chatId:
          type: string
          description: Mesajın ait olduğu sohbetin kimlik numarası
          example: "chat123"
        senderId:
          type: string
          description: Mesajı gönderen kullanıcının kimlik numarası
          example: "user123"
        content:
          type: string
          description: Mesaj içeriği
          example: "Merhaba, projeye katılmak istiyorum!"
        sentAt:
          type: string
          format: date-time
          description: Mesajın gönderilme tarihi (ISO 8601 formatında)
          example: "2026-02-20T15:00:00Z"
      required:
        - chatId
        - senderId
        - content

    MessageInput:
      type: object
      description: Mesaj gönderme isteği için gönderilecek veri
      properties:
        content:
          type: string
          description: Mesaj içeriği
          minLength: 1
          maxLength: 1000
          example: "Merhaba, projeye katılmak istiyorum!"
      required:
        - content
    EkipIlani:
      type: object
      description: Ekip ilanı bilgilerini temsil eden model
      properties:
        _id:
          type: string
          description: Ekip ilanının benzersiz kimlik numarası (otomatik atanır)
          example: "team123"
        baslik:
          type: string
          description: Ekip ilanının başlığı
        aciklama:
          type: string
          description: Ekip ilanının açıklama metni
        kontenjan:
          type: integer
          description: Ekipteki maksimum kişi sayısı
          minimum: 2
          maximum: 50
          example: 8
        mevcutUyeSayisi:
          type: integer
          description: Ekipteki mevcut üye sayısı
          example: 3
        arananYetkinlikler:
          type: array
          description: Ekip üyelerinde aranan yetkinlikler veya özellikler
          items:
            type: string
        olusturanId:
          type: string
          description: İlanı oluşturan kullanıcının kimlik numarası
          example: "user456"
        uyeler:
          type: array
          description: Ekip üyelerinin kimlik numaraları
          items:
            type: string
          example: ["user456", "user789", "user101"]
        olusturulmaTarihi:
          type: string
          format: date-time
          description: İlanın oluşturulma tarihi (ISO 8601 formatında)
          example: "2026-03-01T10:00:00Z"
        guncellenmeTarihi:
          type: string
          format: date-time
          description: İlanın son güncellenme tarihi (ISO 8601 formatında)
          example: "2026-03-04T12:30:00Z"
      required:
        - baslik
        - kontenjan
        - aranan yetkinlikler

    EkipIlaniInput:
      type: object
      description: Ekip ilanı oluşturma veya güncelleme isteği için gönderilecek veri
      properties:
        baslik:
          type: string
          description: Ekip ilanının başlığı
          minLength: 5
          maxLength: 100

        aciklama:
          type: string
          description: Ekip ilanının açıklama metni
          minLength: 10
          maxLength: 1000

        kontenjan:
          type: integer
          description: Ekipteki maksimum kişi sayısı
          minimum: 2
          maximum: 50
          example: 8
        arananYetkinlikler:
          type: array
          description: Ekip üyelerinde aranan yetkinlikler veya özellikler
          items:
            type: string
      required:
        - baslik
        - kontenjan
        - aranan yetkinlikler

    KatilimYaniti:
      type: object
      description: Ekibe katılma işleminin sonucunu temsil eden model
      properties:
        message:
          type: string
          description: İşlem sonuç mesajı
          example: "Ekibe başarıyla katıldınız."
        teamId:
          type: string
          description: Katılınan ekibin kimlik numarası
          example: "team123"
        mevcutUyeSayisi:
          type: integer
          description: Katılım sonrası güncel üye sayısı
          example: 4
      required:
        - message
        - teamId
    AyrilmaYaniti:
      type: object
      description: Ekipten ayrılma işleminin sonucunu temsil eden model
      properties:
        message:
          type: string
          description: İşlem sonuç mesajı
          example: "Ekipten başarıyla ayrıldınız."
        teamId:
          type: string
          description: Ayrılınan ekibin kimlik numarası
          example: "team123"
        mevcutUyeSayisi:
          type: integer
          description: Ayrılma sonrası güncel üye sayısı
          example: 3
      required:
        - message
        - teamId
    Comment:
      type: object
      properties:
        id:
          type: integer
          example: 101
        authorName:
          type: string
          example: Ahmet Yılmaz
        profileInfo:
          type: string
          example: Bilgisayar Mühendisliği 3. sınıf
        text:
          type: string
          example: Bu etkinlik çok faydalı olmuş.
        date:
          type: string
          format: date-time
          example: 2026-05-01T14:30:00Z

    CommentInput:
      type: object
      required:
        - text
      properties:
        text:
          type: string
          minLength: 1
          example: Harika bir paylaşım olmuş!

    ChatInput:
      type: object
      required:
        - receiverId
      properties:
        receiverId:
          type: integer
          example: 45
        initialMessage:
          type: string
          example: Merhaba, proje hakkında konuşabilir miyiz?

    Error:
      type: object
      required:
        - code
        - message
      properties:
        code:
          type: string
          description: Hata kodu
          example: "VALIDATION_ERROR"
        message:
          type: string
          description: Hata mesajı
          example: "Geçersiz email adresi"

  responses:
    BadRequest:
      description: Geçersiz istek
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/Error"
          examples:
            sampleBadRequest:
              summary: Parametre hatası
              value:
                code: "BAD_REQUEST"
                message: "İstek parametreleri geçersiz"

    Unauthorized:
      description: Yetkisiz erişim
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/Error"
          examples:
            sampleUnauthorized:
              summary: Yetkisiz erişim
              value:
                code: "UNAUTHORIZED"
                message: "Kimlik doğrulama başarısız"

    NotFound:
      description: Kaynak bulunamadı
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/Error"
          examples:
            sampleNotFound:
              summary: Kaynak bulunamadı
              value:
                code: "NOT_FOUND"
                message: "İstenen kaynak bulunamadı"

    Forbidden:
      description: Erişim reddedildi
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/Error"
          examples:
            sampleForbidden:
              summary: Erişim reddedildi
              value:
                code: "FORBIDDEN"
                message: "Bu işlem için yetkiniz bulunmamaktadır"

``
