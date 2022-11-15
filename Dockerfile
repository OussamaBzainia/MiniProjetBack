FROM node:16
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm install
COPY . .
EXPOSE 9090
CMD ["node", "server.js"]