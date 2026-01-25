FROM node:latest

WORKDIR /web-server

COPY . .

RUN npm install

#cpp server port
ENV PORT=12345
#cpp server ip addres
ENV SERVERIP=127.0.0.1
#web server port
ENV WEB_SERVER_PORT=8080

#ENV MONGO_URI=mongodb://127.0.0.1:27017/apidb

CMD ["node", "server.js"]