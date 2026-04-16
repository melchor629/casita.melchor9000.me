# syntax=docker/dockerfile:1

ARG NODE=node:24-alpine
ARG BUN=oven/bun:alpine

FROM --platform=$BUILDPLATFORM $BUN AS packages

WORKDIR /app

COPY . .
RUN bunx turbo@^2 prune nas-persistance --docker


FROM --platform=$BUILDPLATFORM $BUN AS builder

WORKDIR /app

COPY --from=packages /app/out/json/ ./
RUN bun i --frozen-lockfile

COPY --from=packages /app/out/full/ ./
RUN bun run build


FROM $BUN AS installer

WORKDIR /app

COPY --from=packages /app/out/json/ ./
RUN bun i --production


FROM $NODE AS final

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
