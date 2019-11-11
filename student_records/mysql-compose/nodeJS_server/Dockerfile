FROM node:latest

WORKDIR ./
COPY package*.json ./
RUN npm install
RUN npm install nodemailer
RUN npm install express-session
RUN npm install mysql
RUN npm install body-parser
RUN npm install path
#If we want to add https, to be corrected
#RUN openssl req -nodes -new -x509 -keyout server.key -out server.cert
# " / " required!
COPY ./ ./ 
EXPOSE 8080

CMD ["node", "server.js"]
