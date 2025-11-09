# syntax=docker/dockerfile:1

ARG TAG=24-alpine

FROM --platform=$BUILDPLATFORM node:$TAG AS packages

WORKDIR /app

RUN npm i -g turbo@^2

COPY . .
RUN npx turbo prune ledefault --docker && \
  mkdir -p /app/out/json/packages/nice-ssr/bin && \
  cp /app/packages/nice-ssr/bin/*.js /app/out/json/packages/nice-ssr/bin/


FROM --platform=$BUILDPLATFORM node:$TAG AS builder

WORKDIR /app

COPY --from=packages /app/out/json/ ./
RUN npm ci

COPY --from=packages /app/out/full/ ./
RUN npm run build


FROM node:$TAG AS installer

WORKDIR /app

COPY --from=packages /app/out/json/ ./
RUN npm i --omit=dev


FROM node:$TAG AS final

WORKDIR /app

COPY --from=installer /app ./

COPY --from=builder /app/apps/ledefault/dist/ ./apps/ledefault/dist/
COPY --from=builder /app/packages/nice-ssr/dist/fastify/ ./packages/nice-ssr/dist/fastify/
COPY --from=builder /app/packages/fastify-infra/src/ ./packages/fastify-infra/src/
COPY --from=builder /app/packages/infra/src/ ./packages/infra/src/

ENV NODE_ENV=production
USER node:node

WORKDIR /app/apps/ledefault
CMD ["node", "./dist/server.ts"]
