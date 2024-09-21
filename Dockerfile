# build stage
FROM node:lts-alpine as build-stage
ARG BUILD_TAG=dev
WORKDIR /app
COPY package*.json ./
COPY nginx_${BUILD_TAG}.conf ./nginx.conf
COPY auth_user_file.conf ./
RUN npm install
COPY . .
RUN npm run build:${BUILD_TAG}

# deploy stage
FROM nginx:stable-alpine as deploy-stage
ARG BUILD_TAG=dev
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx_${BUILD_TAG}.conf /etc/nginx/conf.d/default.conf
COPY auth_user_file.conf /etc/nginx/auth_user_file.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]