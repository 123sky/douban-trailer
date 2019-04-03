FROM node:10-alpine

ENV NODE_ENV=production
ENV APP_PATH /douban-trailer
ENV BASE_URL http://chenjianpeng.xyz:3000

# Create app directory
WORKDIR $APP_PATH

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

# 设置时区
RUN rm -rf /etc/localtime && ln -s /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

RUN echo "https://mirrors.aliyun.com/alpine/v3.8/main/" > /etc/apk/repositories \
  && echo "https://mirrors.aliyun.com/alpine/v3.8/community/" >> /etc/apk/repositories \
  && echo "https://mirrors.aliyun.com/alpine/edge/testing/" >> /etc/apk/repositories \
  && apk -U --no-cache update && apk -U --no-cache --allow-untrusted add \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ttf-freefont

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Add user so we don't need --no-sandbox.
RUN mkdir -p /home/pptruser/Downloads \
  && mkdir /app

CMD [ "yarn", "start" ]
