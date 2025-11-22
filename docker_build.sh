#!/usr/bin/env bash

set -e

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
APP_NAME="$1"

if [[ -z "${APP_NAME}" ]]; then
  APP_NAME="$(basename "$PWD")"
fi

APP_PATH="${SCRIPT_DIR}/apps/${APP_NAME}"
if [[ -f "${APP_PATH}/docker/Dockerfile" ]]; then
  DOCKERFILE_PATH="${APP_PATH}/docker/Dockerfile"
elif [[ -f "${APP_PATH}/Dockerfile" ]]; then
  DOCKERFILE_PATH="${APP_PATH}/Dockerfile"
else
  echo "Could not find Dockerfile for app ${APP_NAME}"
  exit 1
fi

echo ">> Building app ${APP_NAME}"
exec docker image build \
  --no-cache --pull \
  -f "${DOCKERFILE_PATH}" \
  --output type=tar,dest=/dev/null \
  "${SCRIPT_DIR}"
