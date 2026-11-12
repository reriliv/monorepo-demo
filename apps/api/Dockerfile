# ==========================================
# 阶段 1：构建阶段
# ==========================================
FROM node:24-alpine AS builder
WORKDIR /app

COPY . .

RUN corepack enable && pnpm install --frozen-lockfile

WORKDIR /app/apps/api
RUN pnpm run build

# ==========================================
# 阶段 2：运行阶段
# ==========================================
FROM node:24-alpine AS runner
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api ./apps/api

WORKDIR /app/apps/api
EXPOSE 3000
CMD ["node", "dist/main.js"]
