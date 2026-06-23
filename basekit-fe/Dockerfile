FROM node:24-alpine AS base
RUN npm i -g pnpm

FROM base AS dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --ignore-scripts
RUN pnpm rebuild esbuild lightningcss

FROM base AS build
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
ARG VITE_API_BASE_URL
ARG VITE_TENANT_SLUG
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_TENANT_SLUG=$VITE_TENANT_SLUG
RUN pnpm build

FROM nginx:alpine AS deploy
COPY --from=build /app/dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
