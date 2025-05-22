# Etap budowania aplikacji
FROM node:23-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm install --only=production

# Etap produkcyjny
FROM node:23-slim
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src ./src
EXPOSE 3003
CMD ["node", "src/server.js"]
