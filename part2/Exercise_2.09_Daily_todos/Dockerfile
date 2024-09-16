FROM alpine:latest

RUN apk add --no-cache curl bash

COPY cronjob.sh /app/cronjob.sh

RUN chmod +x /app/cronjob.sh

WORKDIR /app

CMD ["./cronjob.sh"]