#!/usr/bin/env bash

set -e

IMAGE_NAME="melchor9000/ledefault"
IMAGE_PLATFORMS="amd64 arm64"

if which jq > /dev/null; then
  VERSION="$(cat package.json | jq -r '.version')"
else
  VERSION=$(cat package.json | awk '/version/{ print $2 }' | tr -d '",')
fi

UPLOAD=""
if [[ "${1}" = "--upload" ]]; then
  UPLOAD='yes'
  shift
fi

if [[ ! -z "$@" ]]; then
  IMAGE_PLATFORMS="$@"
fi

function is_stable() {
  exec echo "${VERSION}" | egrep -v 'alpha|beta' > /dev/null
}

function upload() {
  exec echo "${UPLOAD}" | grep 'yes' > /dev/null
}

command="docker image build -t ${IMAGE_NAME}:${VERSION} --no-cache --pull -f docker/Dockerfile --platform "

for platform in ${IMAGE_PLATFORMS}; do
  command="${command}linux/${platform},"
done
command="${command%,*}"

if is_stable; then
  command="${command} -t ${IMAGE_NAME}:latest"
fi

if upload; then
  command="${command} --push"
fi

command="${command} ../.."

echo $command
$command
