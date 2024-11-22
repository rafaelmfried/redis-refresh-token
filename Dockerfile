FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
EXPOSE 8000

CMD ["npm", "run", "start:dev", "--exec", "node -r nestjs-devtools"]

# CMD ["npm", "run", "start:dev"]