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

# Defaults — can be overridden by build args. The /backend proxy reads its
# target from runtime env, but the client bundle embeds PROXY_TARGET at build
# time (used to strip the internal origin from absolute URLs that backend
# emits via request.build_absolute_uri). If your deployment uses a different
# backend hostname, pass it via --build-arg.
ARG NEXT_PUBLIC_API_MODE=real
ARG NEXT_PUBLIC_API_PROXY_TARGET=http://backend:8000/api
ENV NEXT_PUBLIC_API_MODE=$NEXT_PUBLIC_API_MODE
ENV NEXT_PUBLIC_API_PROXY_TARGET=$NEXT_PUBLIC_API_PROXY_TARGET

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
