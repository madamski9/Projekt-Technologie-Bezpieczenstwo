# Etap budowania
FROM node:23-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Etap produkcyjny
FROM node:23-slim 
WORKDIR /app
COPY --from=builder /app /app
EXPOSE 3003
CMD ["node", "src/server.js"]
