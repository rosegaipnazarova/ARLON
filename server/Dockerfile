# 1. Node.js muhitini olamiz
FROM node:22-alpine

# 2. Ishchi papkani belgilaymiz
WORKDIR /app

# 3. Paketlar ro'yxatini ko'chiramiz
COPY package*.json ./

# 4. Paketlarni o'rnatamiz
RUN npm install

# 5. Qolgan barcha kodlarni ko'chiramiz
COPY . .

# 6. Portni ochamiz
EXPOSE 5000

# 7. Backendni ishga tushiramiz
CMD ["node", "index.js"]