# ===== Stage 1: Build =====
FROM node:24-alpine AS builder

WORKDIR /usr/src/app/
USER root

COPY . .

RUN npm install 

ENV VITE_API_URL=/api

RUN npm run build

# ===== Stage 2: Serve =====
FROM nginx:alpine

WORKDIR /usr/share/nginx/html/

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /usr/src/app/dist  /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]