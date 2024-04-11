FROM node:20.11.1-alpine AS builder

ENV NODE_ENV=production

WORKDIR /app

# copy project files to workdir
COPY . .

RUN yarn install
RUN yarn build

# bundle static assets with nginx
FROM nginx:1.25.4-alpine as production


ENV NODE_ENV production

RUN apk add bash

COPY --from=builder /app/build /usr/share/nginx/html
# add your nginx.conf
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./docker/entrypoint.sh ./
COPY ./docker/env.sh ./

RUN install -m 755 ./*.sh /bin/

EXPOSE 80

ENTRYPOINT ["/bin/entrypoint.sh"]
CMD ["app:start"]
