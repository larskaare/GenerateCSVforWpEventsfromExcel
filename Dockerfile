#- Building base layer
FROM node:16-alpine3.14 AS base
WORKDIR /usr/src/app
RUN mkdir -p ./config ./src 
COPY package.json package-lock.json ./
COPY app.js ./
COPY config config
COPY src src

#- Adding dependencies
FROM base as dependencies
WORKDIR /usr/src/app
RUN npm install --only=production
RUN cp -R node_modules node_modules_production
RUN npm install

#- Tests and stuff
FROM dependencies as test
WORKDIR /usr/src/app
COPY test test
RUN npm test
COPY .eslintrc.json .eslintignore ./
RUN npm run lint

#- Creating the release image if everything is good
FROM base as release
WORKDIR /usr/src/app
COPY --from=dependencies /usr/src/app/node_modules_production ./node_modules
COPY --from=test /usr/src/app/.eslintignore ./

RUN addgroup -S -g 1001 apprunner
RUN adduser -S -u 1001 -G apprunner apprunner
USER 1001
ENTRYPOINT [ "/usr/local/bin/node", "./app.js"]
