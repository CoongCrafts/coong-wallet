FROM node:18
ENV YARN_VERSION 3.4.1
RUN yarn policies set-version $YARN_VERSION

WORKDIR /app
COPY package.json .
COPY yarn.lock .
COPY . .
RUN yarn install

EXPOSE 3030

CMD ["yarn", "start"]
