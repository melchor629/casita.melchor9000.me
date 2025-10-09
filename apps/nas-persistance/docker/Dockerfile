# syntax=docker/dockerfile:1

ARG TAG=24-alpine

FROM --platform=$BUILDPLATFORM node:$TAG AS packages

WORKDIR /app

RUN npm i -g turbo@^2

COPY . .
RUN npx turbo prune nas-persistance --docker


FROM --platform=$BUILDPLATFORM node:$TAG AS builder

WORKDIR /app

COPY --from=packages /app/out/json/ ./
RUN npm ci

COPY --from=packages /app/out/full/ ./
RUN CI=true NODE_ENV=production npm run build


FROM node:$TAG AS final

WORKDIR /app

COPY --from=packages /app/out/json/ ./
RUN npm ci --omit=dev

COPY --from=builder /app/apps/nas-persistance/src/ ./apps/nas-persistance/src/
COPY --from=builder /app/packages/fastify-infra/src/ ./packages/fastify-infra/src/
COPY --from=builder /app/packages/prisma-nas-auth/ ./packages/prisma-nas-auth
COPY apps/nas-persistance/docker/entrypoint.sh /entrypoint.sh

USER node:node
ENV PORT=8000 \
  NODE_ENV=production

WORKDIR /app/apps/nas-persistance
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nas-persistence"]
