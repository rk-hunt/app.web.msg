#!/bin/bash

check_env() {
  local var="$1"

  if [[ ! "${!var:-}" ]] ; then
    echo >&2 "ERROR: $var is not set"
    exit 1
  else
    if [[ ${NODE_ENV} != "production" ]]; then
      echo "INIT $var : ${!var}"
    fi
  fi
}

envs=(
  NDOE_ENV
  REACT_APP_API_URL
)

case ${1} in
  app:start)
    for e in "${envs[@]}"; do
        check_env "$e"
    done

    (
      exec /bin/env.sh > /usr/share/nginx/html/config.js
    )

    echo "start web app"
    exec /usr/sbin/nginx -g "daemon off;"
  ;;

  *)
    exec "$@"
  ;;

esac