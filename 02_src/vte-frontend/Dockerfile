# --- Stage 1: Install dependencies ---
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# --- Stage 2: Build ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Defaults — can be overridden by build args. Runtime env vars also work
# for NEXT_PUBLIC_API_MODE / NEXT_PUBLIC_API_PROXY_TARGET because the
# Next.js API-route at /backend reads them server-side at request time.
ARG NEXT_PUBLIC_API_MODE=real
ENV NEXT_PUBLIC_API_MODE=$NEXT_PUBLIC_API_MODE

RUN npm run build

# --- Stage 3: Production ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy only what's needed to run
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
