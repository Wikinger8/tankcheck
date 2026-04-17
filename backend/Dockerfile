FROM node:20-alpine AS builder
WORKDIR /app
COPY backend/package*.json ./backend/
COPY packages/shared/package*.json ./packages/shared/
COPY package*.json ./
RUN npm install --workspace=backend
COPY packages/shared/ ./packages/shared/
COPY backend/ ./backend/
RUN npm run build --workspace=backend

FROM node:20-alpine
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/package.json ./
USER nestjs
EXPOSE 3001
CMD ["node", "dist/main.js"]
