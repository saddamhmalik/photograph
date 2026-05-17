FROM nginx:alpine

COPY docker/nginx/templates/ /etc/nginx/templates/
COPY docker/nginx/entrypoint.sh /ssl-entrypoint.sh
RUN chmod +x /ssl-entrypoint.sh

ENTRYPOINT ["/ssl-entrypoint.sh"]
