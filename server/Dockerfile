# Temel imaj olarak Node.js 20 Alpine sürümünü kullanıyoruz (hafif olduğu için)
FROM node:20-alpine

# Konteyner içindeki çalışma dizinini ayarlıyoruz
WORKDIR /app

# Önbellek optimizasyonu için önce sadece package.json ve package-lock.json (varsa) kopyalıyoruz
COPY package*.json ./

# Bağımlılıkları yüklüyoruz
RUN npm install

# Kalan tüm uygulama dosyalarını kopyalıyoruz
COPY . .

# Render'ın varsayılan olarak beklediği 10000 portunu dışa açıyoruz
EXPOSE 10000

# Uygulamayı başlatma komutu
CMD ["node", "src/server.js"]
