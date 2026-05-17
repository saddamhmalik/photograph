#!/bin/sh

ROOT="$(dirname "$0")/../.."

cd "${ROOT}"

docker compose --profile cert run --rm certbot renew --quiet

docker compose exec nginx nginx -s reload 2>/dev/null || docker compose restart nginx
