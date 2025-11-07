# syntax=docker/dockerfile:1

ARG TAG=24-slim

FROM --platform=$BUILDPLATFORM node:$TAG AS packages

WORKDIR /app

RUN npm i -g turbo@^2

COPY . .
RUN npx turbo prune nas-fs --docker


FROM --platform=$BUILDPLATFORM node:$TAG AS builder

WORKDIR /app
COPY --from=packages /app/out/json/ ./
RUN npm ci --omit=dev

COPY --from=packages /app/out/full/ ./
COPY /apps/nas-fs/docker/entrypoint.sh ./


FROM node:$TAG AS installer

WORKDIR /app

COPY --from=packages /app/out/json/ ./
RUN npm i --omit=dev


FROM node:$TAG AS final
WORKDIR /app

RUN <<APP
  set -ex

  apt update
  apt install --no-install-recommends -y curl ca-certificates jq

  curl -sSL https://mediaarea.net/repo/deb/repo-mediaarea_1.0-25_all.deb > repo-mediaarea.deb
  dpkg -i repo-mediaarea.deb
  rm repo-mediaarea.deb

  apt update
  apt install --no-install-recommends --no-install-suggests -y mediainfo libjemalloc2 file

  . /etc/os-release
  ARCH=$(dpkg --print-architecture)
  DOWNLOAD_URL=$(curl https://api.github.com/repos/jellyfin/jellyfin-ffmpeg/releases/latest | jq -r ".assets[] | select(.name | contains(\"${VERSION_CODENAME}_${ARCH}.deb\")) | .browser_download_url")
  if [ -z "$DOWNLOAD_URL" ]; then
    echo "Could not find a .deb of ffmpeg for ${VERSION_CODENAME}_${ARCH}"
    exit 1
  fi
  curl -fsSL "${DOWNLOAD_URL}" > ffmpeg.deb
  apt install -y ./ffmpeg.deb
  ln -s /usr/lib/jellyfin-ffmpeg/ffmpeg /usr/bin/ffmpeg
  rm ffmpeg.deb

  apt purge -y curl jq
  npm cache clean --force
  apt clean -y
  apt autoremove -y --purge
  rm -rf /var/lib/apt/lists/*
  rm -rf /root/.cache /root/.npm
  rm -rf /etc/apt/keyrings
APP

COPY --from=installer /app ./

COPY --from=builder /app/apps/nas-fs/ ./apps/nas-fs/
COPY --from=builder /app/packages/fastify-infra/src/ ./packages/fastify-infra/src/
COPY /apps/nas-fs/docker/entrypoint.sh ./

ENV PORT=3001
ENV NODE_ENV=production
ENV LANG=C.UTF-8

WORKDIR /app/apps/nas-fs/
ENTRYPOINT [ "/app/entrypoint.sh" ]
