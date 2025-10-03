#!/bin/ash

if [ "$1" = "nas-persistence" ]; then
  shift
  exec node /app/dist/index.js "$@"
fi

if [ "$1" = "run-migrations" ]; then
  echo " > Running migrations for nas-auth"
  npx typeorm migration:run -d orm/nas-auth/connection.js || exit $?

  fs_tenants=$(echo "${NAS_PERSISTENCE_FS_TENANTS}" | tr ',' '\n')
  for tenant in fs_tenants; do
    echo " > Running migrations for nas-fs:${tenant}"
    NAS_PERSISTENCE_FS_TENANTS="${tenant}" npx typeorm migration:run -d orm/nas-fs/connection.js || exit $?
  done

  exit 0
fi

if [ "$#" -eq 0 ]; then
    exec node /app/dist/index.js
fi

exec "$@"
