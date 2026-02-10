FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000

LABEL org.opencontainers.image.source="https://github.com/incept5/eve-horizon-showcase"
LABEL org.opencontainers.image.description="Eve Horizon Agent Platform Showcase"
