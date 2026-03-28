FROM node:20-bullseye-slim

# Prisma needs OpenSSL available at runtime
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies
COPY backend/package*.json ./
RUN npm ci

# Copy source
COPY backend/tsconfig.json ./tsconfig.json
COPY backend/prisma ./prisma
COPY backend/src ./src
COPY backend/lib ./lib
COPY backend/script.ts ./script.ts

# Generate Prisma client (needs DATABASE_URL at runtime only)
RUN npx prisma generate

ENV PORT=5000
EXPOSE 5000

# Start the API
CMD ["npx", "tsx", "src/server.ts"]
