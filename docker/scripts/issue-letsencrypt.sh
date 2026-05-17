#!/bin/sh
set -e

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "${ROOT}"

# shellcheck disable=SC1091
. "${ROOT}/docker/scripts/load-env.sh"

if [ -z "${CERT_DOMAIN:-}" ]; then
  echo "CERT_DOMAIN is not set. Add CERT_DOMAIN=photo.codikal.com to ${ROOT}/.env" >&2
  exit 1
fi

if [ -z "${CERTBOT_EMAIL:-}" ]; then
  echo "CERTBOT_EMAIL is not set. Add CERTBOT_EMAIL=your@email.com to ${ROOT}/.env" >&2
  exit 1
fi

CERT_PATH="/etc/letsencrypt/live/${CERT_DOMAIN}/fullchain.pem"

if docker compose exec -T nginx test -f "${CERT_PATH}" 2>/dev/null; then
  echo "Certificate already exists for ${CERT_DOMAIN}. Reloading nginx only."
  docker compose up -d --force-recreate nginx
  echo "Done. Test: curl -sI http://${CERT_DOMAIN}/ | head -3"
  exit 0
fi

docker compose --profile cert run --rm certbot certonly \
  --webroot \
  -w /var/www/certbot \
  -d "${CERT_DOMAIN}" \
  --email "${CERTBOT_EMAIL}" \
  --agree-tos \
  --no-eff-email \
  --non-interactive

docker compose build nginx
docker compose up -d --force-recreate nginx

echo "Certificate issued. Test: curl -sI https://${CERT_DOMAIN}/ | head -3"
