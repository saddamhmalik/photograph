#!/bin/sh
set -e

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "${ROOT}"

# shellcheck disable=SC1091
. "${ROOT}/docker/scripts/load-env.sh"

docker compose --profile cert run --rm certbot renew --quiet

docker compose exec nginx nginx -s reload 2>/dev/null || docker compose restart nginx
