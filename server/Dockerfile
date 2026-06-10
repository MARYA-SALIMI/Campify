FROM node:20-alpine

WORKDIR /app

# Package dosyalarini kopyala ve bagimliliklari yukle
COPY package*.json ./
RUN npm ci --only=production

# Tum kaynak kodunu kopyala
COPY index.js ./
COPY src/ ./src/

# Port tanimla
EXPOSE 3000

# index.js'in bulundugu kok dizinden baslat
CMD ["node", "index.js"]
