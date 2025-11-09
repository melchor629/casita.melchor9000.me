# syntax=docker/dockerfile:1

ARG TAG=24-alpine

FROM --platform=$BUILDPLATFORM node:$TAG AS packages

WORKDIR /app

RUN npm i -g turbo@^2

COPY . .
RUN npx turbo prune nas-persistance --docker


FROM --platform=$BUILDPLATFORM node:$TAG AS builder

ARG TARGETARCH
WORKDIR /app

COPY --from=packages /app/out/json/ ./
RUN npm ci

COPY --from=packages /app/out/full/ ./
RUN <<EOM
  if [ "$TARGETARCH" = "amd64" ]; then
    echo "Detected amd64 for prisma"
    export PRISMA_BINARY_TARGET="[\"linux-musl-openssl-3.0.x\"]"
  elif [ "$TARGETARCH" = "arm64" ]; then
    echo "Detected arm64 for prisma"
    export PRISMA_BINARY_TARGET="[\"linux-musl-arm64-openssl-3.0.x\"]"
  else
    echo "Not supported arch!"
    exit 1
  fi
  npm run build
EOM


FROM node:$TAG AS installer

WORKDIR /app

COPY --from=packages /app/out/json/ ./
RUN npm i --omit=dev


FROM node:$TAG AS final

WORKDIR /app

COPY --from=installer /app ./

COPY --from=builder /app/apps/nas-persistance/src/ ./apps/nas-persistance/src/
COPY --from=builder /app/packages/fastify-infra/src/ ./packages/fastify-infra/src/
COPY --from=builder /app/packages/infra/src/ ./packages/infra/src/
COPY --from=builder /app/packages/prisma-nas-auth/ ./packages/prisma-nas-auth
COPY apps/nas-persistance/docker/entrypoint.sh /entrypoint.sh

USER node:node
ENV PORT=8000 \
  NODE_ENV=production

WORKDIR /app/apps/nas-persistance
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nas-persistence"]
