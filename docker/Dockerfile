FROM mhart/alpine-node:15

ARG FC_COUNTRY

RUN set -x \
    && apk add --no-cache git bash \
    && git --version && bash --version && node -v && npm -v

WORKDIR /app
COPY package.json /app
RUN npm install --production --no-audit

COPY .env .bin/fc-agent  /app/
RUN chmod +x /app/fc-agent
ENV PATH="/app:${PATH}"

RUN mkdir -p /app/data-${FC_COUNTRY}

ENTRYPOINT [ "fc-agents-init" ]
