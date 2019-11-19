FROM node:latest

WORKDIR ./
COPY package*.json .
RUN npm install
#If we want to add https, to be corrected
#RUN openssl req -nodes -new -x509 -keyout server.key -out server.cert
COPY . .
EXPOSE 8000
EXPOSE 8080

CMD ["node", "server.js"]