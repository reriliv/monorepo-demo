# ---- build ----
FROM node:24-alpine AS builder
WORKDIR /app
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/remote-app ./apps/remote-app
RUN corepack enable && pnpm install --frozen-lockfile
RUN pnpm --filter remote-app build

# ---- runtime ----
FROM nginx:alpine
COPY --from=builder /app/apps/remote-app/dist /usr/share/nginx/html
COPY apps/remote-app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
