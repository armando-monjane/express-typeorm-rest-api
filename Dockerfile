FROM node:18-slim as build-stage

USER ${USER_NAME}

WORKDIR /app

COPY --chown=app:app package*.json ./

RUN npm install

COPY --chown=app:app . ./

# Test build stage
FROM build-stage as test-stage

CMD ["npm", "run", "test"]

# Build dev stage
FROM build-stage as dev-stage

EXPOSE 3000

CMD ["npm", "run", "dev"]
