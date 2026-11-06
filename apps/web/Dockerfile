# ==========================================
# 阶段 1：构建阶段 (Builder) - 用 Node 编译代码
# ==========================================
# syntax=docker/dockerfile:1.4
FROM node:24-alpine AS builder
WORKDIR /app

COPY . .

RUN corepack enable

RUN pnpm install --frozen-lockfile

WORKDIR /app/apps/web

RUN pnpm run build

# ==========================================
# 阶段 2：运行阶段 (Runner) - 用 Nginx 托管静态文件
# ==========================================
FROM nginx:alpine
# WORKDIR /app

RUN mv /app/apps/web/dist /usr/share/nginx/html/web

RUN rm /etc/nginx/conf.d/web.conf

COPY --from=builder /app/apps/web/deploy/nginx.conf /etc/nginx/conf.d/web.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
