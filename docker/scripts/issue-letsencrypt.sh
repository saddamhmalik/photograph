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

docker compose --profile cert run --rm certbot certonly \
  --webroot \
  -w /var/www/certbot \
  -d "${CERT_DOMAIN}" \
  --email "${CERTBOT_EMAIL}" \
  --agree-tos \
  --no-eff-email \
  --non-interactive

docker compose restart nginx

echo "Certificate issued for ${CERT_DOMAIN}. Open https://${CERT_DOMAIN}"
