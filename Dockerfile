FROM node:10.16 as build-stage

WORKDIR /app
COPY ./package.json ./
COPY ./yarn.lock ./
RUN yarn install
COPY ./docusaurus.config.js ./
COPY . ./
RUN yarn build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/build /usr/share/nginx/html
COPY --from=build-stage /app/static /usr/share/nginx/html/static
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
