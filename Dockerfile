# Multi-stage build for LMS application
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY Backend/package.json Backend/package-lock.json* ./Backend/
COPY client/package.json client/package-lock.json* ./client/
RUN npm ci --only=production --prefix ./Backend && npm ci --only=production --prefix ./client

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY Backend/ ./Backend/
COPY client/ ./client/

# Build the frontend
RUN npm run build --prefix ./client

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 5000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the built application
COPY --from=builder /app/Backend ./Backend
COPY --from=builder /app/client/dist ./client/dist
COPY --from=deps /app/Backend/node_modules ./Backend/node_modules

# Copy environment variables (you'll need to create a .env file)
COPY Backend/.env* ./Backend/

USER nextjs

EXPOSE 5000

ENV PORT 5000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "Backend/server.js"] 