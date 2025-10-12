#!/bin/ash

if [ "$1" = "nas-persistence" ]; then
  shift
  exec node /app/apps/nas-persistance/src/index.ts "$@"
fi

if [ "$1" = "run-migrations" ]; then
  echo " > Running migrations for nas-auth"
  npm run -ws --if-present db:deploy || exit $?

  exit 0
fi

if [ "$#" -eq 0 ]; then
  exec node /app/apps/nas-persistance/src/index.ts
fi

exec "$@"
