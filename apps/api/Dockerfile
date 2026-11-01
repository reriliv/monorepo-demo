# syntax=docker/dockerfile:1.4
# ==========================================
# 阶段 1：构建阶段 (Builder)
# ==========================================
FROM node:24-alpine AS builder
WORKDIR /app

# 1. 复制整个项目到容器内
COPY . .

# 2. 启用 pnpm
RUN corepack enable

# 3. 全局安装依赖（在根目录执行）
# 注意：这里不加 --frozen-lockfile 可能会导致报错，但如果是 pnpm v8+ 建议加上
RUN pnpm install --frozen-lockfile

# 4. 切换到 api 所在的目录
WORKDIR /app/apps/api

# 5. 执行构建命令
RUN pnpm run build

# ==========================================
# 阶段 2：运行阶段 (Runner)
# ==========================================
FROM node:24-alpine AS runner
WORKDIR /app

# 为了在生产环境运行，我们需要带上 node_modules
# 由于 Monorepo 的特性，依赖通常被 pnpm 提升到了根目录的 node_modules
COPY --from=builder /app/node_modules ./node_modules

# 把 api 目录拷贝过来（包含编译后的 dist 和 package.json）
COPY --from=builder /app/apps/api ./apps/api

# 进入 api 目录
WORKDIR /app/apps/api

EXPOSE 3000

# 运行编译后的 Node 服务
CMD ["node", "dist/main.js"]
