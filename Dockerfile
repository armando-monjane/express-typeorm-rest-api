FROM node:18-slim as build-stage

WORKDIR /app

COPY package*.json /app

RUN npm install

# Test build stage
FROM build-stage as test-stage

CMD ["npm", "run", "test"]

# Build dev stage
FROM build-stage as dev-stage

EXPOSE 3000

CMD ["npm", "run", "dev"]
