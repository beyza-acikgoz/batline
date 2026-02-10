# Node.js alpine tabanlı image
FROM node:20-alpine

# Çalışma dizini
WORKDIR /app

# package dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Projeyi kopyala
COPY . .

# .env dosyasını kopyala
COPY .env .env

# TypeScript derle (build)
RUN npm run build

# Portu aç
EXPOSE 3000

# Production start
CMD ["npm", "start"]
