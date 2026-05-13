# 1. Node.js'in hafif bir sürümünü kullanıyoruz
FROM node:22-alpine

# 2. Uygulama klasörünü oluştur
WORKDIR /app

# 3. Bağımlılıkları kopyala ve yükle
COPY package*.json ./
RUN npm install

# 4. Tüm kodları kopyala
COPY . .

# 5. Uygulamanın çalışacağı port
EXPOSE 3000

# 6. Uygulamayı başlat
CMD ["npm", "start"]                              