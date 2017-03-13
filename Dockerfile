FROM mhart/alpine-node:7

WORKDIR /src
ADD . .

RUN apk add --no-cache make gcc g++ python

RUN npm install

VOLUME /data

CMD ["node", "index.js"]
