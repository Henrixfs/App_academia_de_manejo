FROM oven/bun:1.3.14-alpine AS dependencies

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM oven/bun:1.3.14-alpine AS builder

WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ARG BACKEND_URL=http://backend:8000
ARG NEXT_PUBLIC_APP_URL=http://localhost:3000
ENV BACKEND_URL=$BACKEND_URL NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL NEXT_TELEMETRY_DISABLED=1
RUN bun run build

FROM node:24-alpine AS runtime

ARG BACKEND_URL=http://backend:8000
ARG NEXT_PUBLIC_APP_URL=http://localhost:3000
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0 BACKEND_URL=$BACKEND_URL NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD ["wget", "--no-verbose", "--tries=1", "--spider", "http://127.0.0.1:3000/"]
CMD ["node", "server.js"]
