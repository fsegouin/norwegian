FROM mhart/alpine-node:7

WORKDIR /src
ADD . .

RUN npm install

VOLUME /data

CMD ["node", "index.js"]
