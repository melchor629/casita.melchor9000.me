if [ -z "${BASE_PATH}" ]; then
  export BASE_PATH="/"
fi

if which jq > /dev/null; then
  export VITE_VERSION="$(cat package.json | jq -r '.version')"
else
  export VITE_VERSION=$(cat package.json | awk '/version/{ print $2 }' | tr -d '",')
fi

if [ `which git` ] && [ -d .git ]; then
  export VITE_REVISION="$(git rev-parse --short HEAD)"
fi

if [ "production" = "${NODE_ENV}" ]; then
  export VITE_BUILD_DATE="$(date -Iminutes || date '+%Y-%m-%dT%H:%M')"
fi
