# Stage 1: Build the app
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript -> dist/
RUN npm run build

# Stage 2: Production image
FROM node:22-alpine

WORKDIR /app

# Copy only prod deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built code from builder
COPY --from=builder /app/dist ./dist

EXPOSE 3000
ENV NODE_ENV=production

# Start the NestJS app
CMD ["node", "dist/main.js"]
