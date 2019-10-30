FROM node:10

WORKDIR ./
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 8000

CMD ["node", "server.js"]