FROM node:16.17.0 as build

WORKDIR /usr/local/app

COPY ./ /usr/local/app/

RUN npm install

RUN npm run build

FROM nginx:latest

COPY --from=build /usr/local/app/dist/open-connect /usr/share/nginx/html

# Expose port 80
EXPOSE 80


