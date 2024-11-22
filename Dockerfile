FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
# Porta do devmodule
EXPOSE 8000
# Porta do debug do vscode
EXPOSE 9229

CMD ["npm", "run", "start:debug", "--exec", "node -r nestjs-devtools"]

# CMD ["npm", "run", "start:dev"]