FROM node:22

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

# correr el cliente de prisma
RUN npx prisma generate

EXPOSE 8000
