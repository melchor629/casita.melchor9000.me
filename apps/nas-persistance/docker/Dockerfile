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
RUN apk add --no-cache python3 build-base postgresql-dev && \
  npm ci

COPY --from=packages /app/out/full/ ./
RUN CI=true NODE_ENV=production npm run build


FROM node:$TAG AS final

WORKDIR /app

COPY --from=packages /app/out/json/ ./
RUN apk add --no-cache python3 build-base postgresql-dev && \
  npm ci --omit=dev && \
  apk del --no-cache python3 build-base postgresql-dev && \
  apk add --no-cache libpq && \
  npm cache clean --force

COPY --from=builder /app/apps/nas-persistance/dist/ ./apps/nas-persistance/dist/
COPY apps/nas-persistance/docker/entrypoint.sh /entrypoint.sh

USER node:node
ENV PORT=8000 \
  NODE_ENV=production

WORKDIR /app/apps/nas-persistance
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nas-persistence"]
