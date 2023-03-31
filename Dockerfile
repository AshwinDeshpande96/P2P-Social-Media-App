FROM node:16.17.0 AS Production

ENV NODE_ENV=production

WORKDIR /usr/src/api

COPY package*.json ./

RUN npm install

COPY . .

CMD echo "Warming up" && sleep 5 && npm start