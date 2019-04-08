FROM node:10-alpine

ENV NODE_ENV=production
ENV APP_PATH /douban-trailer
ENV BASE_URL http://chenjianpeng.xyz:3000
ENV CHROME_BIN /usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Create app directory
WORKDIR $APP_PATH

# Installs latest Chromium (72) package.
RUN apk update && apk upgrade && \
  echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
  echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
  apk add --update ca-certificates && \
  apk add --no-cache \
  ttf-freefont \
  chromium@edge \
  nss@edge \
  harfbuzz@edge

# Install app dependencies efficiently
# http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/
RUN apk -U --no-cache update \
  && apk add --no-cache --virtual .build-deps alpine-sdk python

COPY package.json /tmp/
COPY yarn.lock /tmp/
RUN cd /tmp && yarn
RUN mv /tmp/node_modules $APP_PATH/node_modules

RUN apk del .build-deps

# Bundle app source
COPY . $APP_PATH

CMD [ "yarn", "start" ]
