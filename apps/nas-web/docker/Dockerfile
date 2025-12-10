# syntax=docker/dockerfile:1

ARG TAG=24-alpine

FROM --platform=$BUILDPLATFORM node:$TAG AS packages

WORKDIR /app

RUN npm i -g turbo@^2

COPY . .
RUN npx turbo prune nas-web --docker


FROM --platform=$BUILDPLATFORM node:${TAG} AS builder

WORKDIR /app
RUN apk add --no-cache jq git

COPY --from=packages /app/out/json/ ./
RUN npm i

COPY --from=packages /app/out/full/ ./
RUN \
  --mount=type=secret,id=IDENTITY_AUTHORITY,env=VITE_IDENTITY_AUTHORITY \
  --mount=type=secret,id=IDENTITY_CLIENT_ID,env=VITE_IDENTITY_CLIENT_ID \
  --mount=type=secret,id=IDENTITY_CLIENT_SECRET,env=VITE_IDENTITY_CLIENT_SECRET \
  NODE_ENV=production npm run build


FROM nginx:alpine-slim

COPY apps/nas-web/docker/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/nas-web/dist/ /usr/share/nginx/html/
