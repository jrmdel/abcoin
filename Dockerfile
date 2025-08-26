FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source code
COPY . .

EXPOSE 3000
ENV NODE_ENV=production

# Start the app
CMD ["node", "src/app.js"]
