FROM ubuntu:latest

WORKDIR ./
COPY ./js-server/package.json .
RUN apt update
RUN apt install -y nodejs npm mysql-server
RUN npm install
COPY ./js-server ./
EXPOSE 8000
EXPOSE 8080

CMD ["node", "server.js"]