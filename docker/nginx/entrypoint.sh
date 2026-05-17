#!/bin/sh
set -e

CERT_DOMAIN="${CERT_DOMAIN:-photo.codikal.com}"
TEMPLATE_DIR="${TEMPLATE_DIR:-/etc/nginx/templates}"
OUT="/etc/nginx/conf.d/default.conf"

if [ -f "/etc/letsencrypt/live/${CERT_DOMAIN}/fullchain.pem" ]; then
    sed -e "s|__CERT_DOMAIN__|${CERT_DOMAIN}|g" "${TEMPLATE_DIR}/conf-https.tpl" >"${OUT}"
else
    sed -e "s|__CERT_DOMAIN__|${CERT_DOMAIN}|g" "${TEMPLATE_DIR}/conf-http.tpl" >"${OUT}"
fi

exec nginx -g "daemon off;"
