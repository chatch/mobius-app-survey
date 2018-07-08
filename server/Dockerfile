FROM node:carbon

WORKDIR /usr/src/app

ADD package.json .
ADD package-lock.json .
RUN npm install

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]