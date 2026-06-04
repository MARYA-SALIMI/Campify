# Node.js'in hafif sürümünü kullan
FROM node:18-alpine

# Çalışma dizinini ayarla
WORKDIR /app

# Paket dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Tüm proje dosyalarını kopyala
COPY . .

# 3000 portunu dışa aç
EXPOSE 3000

# Uygulamayı başlat
CMD ["npm", "start"]