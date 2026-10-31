# Stage 1: Builder - Install dependencies and build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production && \
    npm cache clean --force

# Copy the rest of the application source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production - Create slim runtime image
FROM node:20-alpine AS runner

# Add non-root user for security
RUN addgroup -g 1001 -S nodejs || true && \
    adduser -S nginx -u 1001

WORKDIR /app

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy package.json for health check
COPY package.json ./

# Set ownership to non-root user
RUN chown -R nginx:nodejs /app

# Switch to non-root user
USER nginx

# Expose the port defined in env file
EXPOSE ${PORT:-3000}

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://${HOST:-localhost}:${PORT:-3000}/health || exit 1

# Start the application
CMD ["node", "dist/main"]