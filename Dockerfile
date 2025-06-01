FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

FROM node:20-slim

LABEL org.opencontainers.image.authors="Julia"

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:3000/ || exit 1

CMD ["npm", "start"]
