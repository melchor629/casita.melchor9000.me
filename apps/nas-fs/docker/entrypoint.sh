#!/bin/bash

export LD_PRELOAD=$(echo /usr/lib/*-linux-gnu/libjemalloc.so*)

if [ "$#" -eq 1 ]; then
  if `which $1` > /dev/null; then
    exec "$1"
  else
    exec node /app/apps/nas-fs/src/index.ts "$1"
  fi
fi

if [ "$#" -eq 0 ]; then
  exec node /app/apps/nas-fs/src/index.ts
fi

exec "$@"
