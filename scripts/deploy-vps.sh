#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "usage: deploy-vps.sh <image-reference>" >&2
  exit 64
fi

readonly image="$1"
readonly name="devclub-ui"
readonly previous="${name}-previous"
readonly source_label="org.opencontainers.image.source=https://github.com/devclub-nstru/component_library"
readonly health_timeout_seconds=120

container_exists() {
  docker container inspect "$1" >/dev/null 2>&1
}

start_container() {
  docker run --detach \
    --name "$name" \
    --restart unless-stopped \
    --publish 127.0.0.1:3005:3000 \
    --read-only \
    --tmpfs /tmp \
    --volume devclub-ui-cache:/app/.next/cache \
    --cap-drop ALL \
    --security-opt no-new-privileges \
    --memory 1g \
    --cpus 1 \
    --pids-limit 256 \
    --init \
    --log-opt max-size=10m \
    --log-opt max-file=3 \
    "$image" >/dev/null
}

wait_until_healthy() {
  local deadline=$((SECONDS + health_timeout_seconds))
  local status
  while [ "$SECONDS" -lt "$deadline" ]; do
    status="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}missing{{end}}' "$name")"
    case "$status" in
      healthy) return 0 ;;
      unhealthy | missing) return 1 ;;
    esac
    sleep 2
  done
  return 1
}

roll_back() {
  echo "::error::$image did not become healthy. Rolling back."
  docker logs --tail 100 "$name" 2>&1 || true
  docker rm --force "$name" >/dev/null 2>&1 || true
  if container_exists "$previous"; then
    docker rename "$previous" "$name"
    docker start "$name" >/dev/null
    if wait_until_healthy; then
      echo "Restored the previous container."
    else
      echo "::error::The previous container is not healthy either."
    fi
  fi
  exit 1
}

if ! docker image inspect "$image" >/dev/null 2>&1; then
  docker pull --quiet "$image" >/dev/null
fi

if container_exists "$previous"; then
  docker rm --force "$previous" >/dev/null
fi

if container_exists "$name"; then
  docker stop --time 20 "$name" >/dev/null
  docker rename "$name" "$previous"
fi

start_container || roll_back
wait_until_healthy || roll_back

if container_exists "$previous"; then
  docker rm "$previous" >/dev/null
fi

docker image prune --all --force --filter "label=$source_label" >/dev/null
echo "Deployed $image"
