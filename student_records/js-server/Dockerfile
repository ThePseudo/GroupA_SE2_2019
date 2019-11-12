FROM node:latest

WORKDIR ./
COPY package*.json .
RUN npm install
RUN npm install bcrypt
RUN npm install express
RUN npm install express-session
RUN npm install nodemailer
RUN npm install pug
RUN npm install mysql
#If we want to add https, to be corrected
#RUN openssl req -nodes -new -x509 -keyout server.key -out server.cert
COPY . .
EXPOSE 8000

CMD ["node", "server.js"]