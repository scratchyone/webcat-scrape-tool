FROM node:21 as build
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install
RUN npx playwright install-deps
COPY . .
CMD node main.mjs

