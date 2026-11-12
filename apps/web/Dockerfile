# ==========================================
# 阶段 1：构建阶段
# ==========================================
FROM node:24-alpine AS builder
WORKDIR /app

COPY . .

RUN corepack enable && pnpm install --frozen-lockfile
RUN pnpm --filter web build

# ==========================================
# 阶段 2：运行阶段 (使用 Nginx)
# ==========================================
FROM nginx:alpine

# 1. 删除默认配置
RUN rm /etc/nginx/conf.d/default.conf

# 2. 拷贝项目专属的 Nginx 配置
# 注意：此处源路径为 apps/web/nginx.conf
COPY apps/web/deploy/nginx.conf /etc/nginx/conf.d/web.conf

# 3. 拷贝静态产物
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
