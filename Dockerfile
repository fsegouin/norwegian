FROM mhart/alpine-node:base-7

WORKDIR /src
ADD . .

VOLUME /data

CMD ["node", "index.js"]
