FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# PORT NUMBER
EXPOSE 3030

CMD [ "node", "server.js" ]