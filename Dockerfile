# ===== Stage 1: Build =====
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files trước để cache
COPY package*.json ./

# Cài dependencies
RUN npm install

# Copy source
COPY . .

# Build production
RUN npm run build


# ===== Stage 2: Serve =====
FROM nginx:alpine

# Xoá config mặc định
RUN rm -rf /usr/share/nginx/html/*

# Copy build sang nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]