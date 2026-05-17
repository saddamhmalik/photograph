#!/bin/sh
set -e

CERT_DOMAIN="${CERT_DOMAIN:-photo.codikal.com}"
TEMPLATE_DIR="${TEMPLATE_DIR:-/etc/nginx/templates}"
OUT="/etc/nginx/conf.d/default.conf"

render_http() {
    sed -e "s|__CERT_DOMAIN__|${CERT_DOMAIN}|g" "${TEMPLATE_DIR}/conf-http.tpl" >"${OUT}"
}

render_https() {
    sed -e "s|__CERT_DOMAIN__|${CERT_DOMAIN}|g" "${TEMPLATE_DIR}/conf-https.tpl" >"${OUT}"
}

if [ -f "/etc/letsencrypt/live/${CERT_DOMAIN}/fullchain.pem" ]; then
    render_https
    if ! nginx -t 2>/dev/null; then
        echo "HTTPS nginx config failed; falling back to HTTP-only." >&2
        render_http
    fi
else
    render_http
fi

if ! nginx -t; then
    echo "nginx configuration is invalid." >&2
    cat "${OUT}" >&2
    exit 1
fi

exec nginx -g "daemon off;"
