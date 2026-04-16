# syntax=docker/dockerfile:1

ARG NODE=node:24-slim
ARG BUN=oven/bun:alpine

FROM --platform=$BUILDPLATFORM $BUN AS packages

WORKDIR /app

COPY . .
RUN bunx turbo@^2 prune nas-fs --docker


FROM --platform=$BUILDPLATFORM $BUN AS builder

WORKDIR /app
COPY --from=packages /app/out/json/ ./
RUN bun i --production

COPY --from=packages /app/out/full/ ./
COPY /apps/nas-fs/docker/entrypoint.sh ./


FROM $BUN AS installer

WORKDIR /app

COPY --from=packages /app/out/json/ ./
RUN bun i --production


FROM $NODE AS final
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
COPY --from=builder /app/packages/infra/src/ ./packages/infra/src/
COPY /apps/nas-fs/docker/entrypoint.sh ./

ENV PORT=3001
ENV NODE_ENV=production
ENV LANG=C.UTF-8

WORKDIR /app/apps/nas-fs/
ENTRYPOINT [ "/app/entrypoint.sh" ]
