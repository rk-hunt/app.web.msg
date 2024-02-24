FROM node:20.11.1-alpine AS builder

# set build arguments as environment variables
ARG TOKEN_INFO_API_URL

ENV NODE_ENV=production
ENV REACT_APP_API_URL=$TOKEN_INFO_API_URL

WORKDIR /app

# copy project files to workdir
COPY . .

RUN yarn install
RUN yarn build

# bundle static assets with nginx
FROM nginx:1.25.4-alpine as production

ENV NODE_ENV production

COPY --from=builder /app/build /usr/share/nginx/html
# add your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
