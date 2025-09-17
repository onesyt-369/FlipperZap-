# Static PWA version - build with Node, serve with Nginx
FROM node:20 AS build

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Serve with Nginx
FROM nginx:alpine

COPY --from=build dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]