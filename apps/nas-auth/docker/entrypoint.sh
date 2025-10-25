#!/bin/sh

set -e

if [ "$@" = "nas-auth" ]; then
  if [ ! -f "${JWKS_FILE_PATH}" ]; then
    echo "Generating ${JWKS_FILE_PATH}"
    if [ -z "${JWKS_KEY_TYPES}" ]; then
      export JWKS_KEY_TYPES="ES256 EdDSA:Ed25519 RS256:4096"
      echo "Using default JKWS Key Types (\$JWKS_KEY_TYPES='$JWKS_KEY_TYPES')"
    fi

    node src/generate-keys.js $JWKS_KEY_TYPES
  fi

  exec node src/index.ts
elif [ "$@" = "nas-auth-generate-keys" ]; then
  exec node src/generate-keys.js "$@"
fi

exec "$@"
