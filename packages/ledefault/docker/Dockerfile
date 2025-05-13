FROM --platform=$BUILDPLATFORM node:22-alpine AS packages

WORKDIR /app

RUN npm i -g turbo@^2

COPY . .
RUN npx turbo prune ledefault --docker && \
  mkdir -p /app/out/json/packages/nice-ssr/bin && \
  cp /app/packages/nice-ssr/bin/*.js /app/out/json/packages/nice-ssr/bin/


FROM --platform=$BUILDPLATFORM node:22-alpine AS builder

WORKDIR /app

COPY --from=packages /app/out/json/ ./
RUN npm ci

COPY --from=packages /app/out/full/ ./
RUN npm run build


FROM node:22-alpine AS final

WORKDIR /app

COPY --from=packages /app/out/json/ ./
RUN npm ci --omit=dev
COPY --from=builder /app/packages/ledefault/dist/ ./packages/ledefault/dist/
COPY --from=builder /app/packages/nice-ssr/dist/fastify/ ./packages/nice-ssr/dist/fastify/

ENV NODE_ENV=production
USER node:node

WORKDIR /app/packages/ledefault
CMD ["node", "--experimental-strip-types", "./dist/server.ts"]
