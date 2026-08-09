# syntax=docker/dockerfile:1

ARG BUN=oven/bun:1-alpine

FROM --platform=$BUILDPLATFORM $BUN AS packages

WORKDIR /app

COPY . .
RUN bunx turbo@^2 prune ledefault --docker


FROM --platform=$BUILDPLATFORM $BUN AS builder

WORKDIR /app

COPY --from=packages /app/out/json/ ./
RUN bun i --frozen-lockfile

COPY --from=packages /app/out/full/ ./
COPY ./apps/nas-auth/src/app/icon.png ./apps/nas-auth/src/app/icon.png
RUN bun run build


FROM $BUN AS installer

WORKDIR /app

COPY --from=packages /app/out/json/ ./
RUN bun i --production


FROM $BUN AS final

WORKDIR /app

COPY --from=installer /app ./

COPY --from=builder /app/apps/ledefault/dist/ ./apps/ledefault/dist/
COPY --from=builder /app/packages/nice-ssr/dist/fastify/ ./packages/nice-ssr/dist/fastify/
COPY --from=builder /app/packages/fastify-infra/src/ ./packages/fastify-infra/src/
COPY --from=builder /app/packages/infra/src/ ./packages/infra/src/

ENV NODE_ENV=production
USER bun:bun

WORKDIR /app/apps/ledefault
CMD ["bun", "run", "./dist/server.ts"]
