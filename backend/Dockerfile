# etap budowania
FROM node:23-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# etap uruchamiania
FROM node:23-slim AS production
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src ./src
RUN npm install --only=production
EXPOSE 3000
CMD ["node", "src/server.js"]
