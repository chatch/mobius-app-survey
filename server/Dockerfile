FROM node:carbon

WORKDIR /usr/src/app

ADD package.json .
ADD package-lock.json .
RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]