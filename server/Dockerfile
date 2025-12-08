# Stage 1: Build
FROM node:22-alpine AS Builder

WORKDIR /build

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Run
FROM node:22-alpine AS Production

WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./

RUN npm install

COPY --from=Builder /build/dist ./dist
COPY --from=Builder /build/.env ./.env

EXPOSE 8080

CMD ["npm", "run", "start"]