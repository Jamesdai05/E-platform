# ---- 1. build the React frontend ----
FROM node:24-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ---- 2. backend + built frontend ----
FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY backend/ ./backend/
COPY --from=frontend /app/frontend/build ./frontend/build
RUN mkdir -p uploads

EXPOSE 5000
CMD ["node", "backend/server.js"]