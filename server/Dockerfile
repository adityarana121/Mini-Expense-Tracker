FROM node:18-alpine

WORKDIR /app

# Install build tools for better-sqlite3
RUN apk add --no-cache python3 make g++ 

COPY package*.json ./

RUN npm ci --only=production

COPY . .

# Expose API port
EXPOSE 5000

CMD ["node", "server.js"]
