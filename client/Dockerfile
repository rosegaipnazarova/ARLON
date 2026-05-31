# 1. Node.js muhiti
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# 2. Next.js loyihasini ishlab chiqarish uchun tayyorlaymiz
RUN npm run build

# 3. Frontend porti
EXPOSE 3000

# 4. Loyihani production rejimida yurgizamiz
CMD ["npm", "run", "start"]