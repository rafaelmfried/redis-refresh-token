FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json .

RUN npm install

EXPOSE 3000

COPY . .

CMD ["npm", "start"]