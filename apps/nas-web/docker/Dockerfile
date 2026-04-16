# syntax=docker/dockerfile:1

ARG BUN=oven/bun:alpine

FROM --platform=$BUILDPLATFORM $BUN AS packages

WORKDIR /app

COPY . .
RUN bunx turbo@^2 prune nas-web --docker


FROM --platform=$BUILDPLATFORM $BUN AS builder

WORKDIR /app
RUN apk add --no-cache jq git

COPY --from=packages /app/out/json/ ./
RUN bun i --frozen-lockfile

COPY --from=packages /app/out/full/ ./
RUN \
  --mount=type=secret,id=IDENTITY_AUTHORITY,env=VITE_IDENTITY_AUTHORITY \
  --mount=type=secret,id=IDENTITY_CLIENT_ID,env=VITE_IDENTITY_CLIENT_ID \
  --mount=type=secret,id=IDENTITY_CLIENT_SECRET,env=VITE_IDENTITY_CLIENT_SECRET \
  NODE_ENV=production bun run build


FROM nginx:alpine-slim

COPY apps/nas-web/docker/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/nas-web/dist/ /usr/share/nginx/html/
