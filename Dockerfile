FROM node:10.12.0

ENV NODE_ENV=production
ENV APP_PATH /douban-trailer
ENV BASE_URL http://chenjianpeng.xyz:3000

# Create app directory
WORKDIR $APP_PATH

# Install app dependencies efficiently
# http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/
COPY package.json /tmp/
COPY yarn.lock /tmp/
RUN cd /tmp && yarn
RUN mv /tmp/node_modules $APP_PATH/node_modules

# Bundle app source
COPY . $APP_PATH

CMD [ "npm", "start" ]
