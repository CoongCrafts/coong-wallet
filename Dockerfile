FROM node:18

WORKDIR /app
COPY package.json .
COPY yarn.lock .
COPY . .
RUN yarn install

EXPOSE 3030

CMD ["yarn", "start"]
