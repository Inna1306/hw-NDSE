FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --production

# Копируем весь проект (ES-модули)
COPY . .

RUN mkdir -p uploads

EXPOSE 8080
CMD ["node", "app.js"]