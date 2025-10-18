# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

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
