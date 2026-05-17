#!/bin/sh
set -e

ROOT="$(dirname "$0")/../.."

cd "${ROOT}"

: "${CERT_DOMAIN:?Set CERT_DOMAIN in .env (e.g. photo.codikal.com)}"
: "${CERTBOT_EMAIL:?Set CERTBOT_EMAIL in .env}"

docker compose --profile cert run --rm certbot certonly \
  --webroot \
  -w /var/www/certbot \
  -d "${CERT_DOMAIN}" \
  --email "${CERTBOT_EMAIL}" \
  --agree-tos \
  --no-eff-email \
  --non-interactive

docker compose restart nginx
