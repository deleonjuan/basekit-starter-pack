FROM node:24.13.0
RUN npm install -g pnpm
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/main"]