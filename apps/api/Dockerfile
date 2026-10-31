FROM node:24-alpine AS builder
WORKDIR /root
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/api ./apps/api
RUN corepack enable && pnpm install --frozen-lockfile
RUN pnpm --filter api build

FROM node:24-alpine
WORKDIR /root
ENV NODE_ENV=production
COPY --from=builder /root/apps/api/dist ./dist
COPY --from=builder /root/apps/api/package.json ./
COPY --from=builder /root/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]
