# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Set npm configurations for better reliability
RUN npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retries 5

# Copy package files
COPY package*.json ./

# Install dependencies with timeout and retry settings
RUN npm ci --prefer-offline --no-audit --no-fund

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Set npm configurations for better reliability
RUN npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retries 5

# Copy package files
COPY package*.json ./

# Install production dependencies with optimizations
RUN npm ci --omit=dev --prefer-offline --no-audit --no-fund

# Copy built application from builder stage
COPY --from=builder /app/.nuxt ./.nuxt
COPY --from=builder /app/.output ./.output
COPY prisma ./prisma

# Create data directory for SQLite database
RUN mkdir -p /app/data

# Expose port
EXPOSE 7654

# Set environment variables
ENV NODE_ENV=production
ENV PORT=7654
ENV HOST=0.0.0.0
ENV DATABASE_URL="file:./data/prod.db"

# Run migrations and start the application
CMD ["sh", "-c", "npx prisma migrate deploy && node .output/server/index.mjs"]
