FROM node:21.0-alpine AS development

# Create app directory
WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY .env.example .env
COPY . .

EXPOSE 3000

ENV NODE_ENV production

CMD ["npm", "run", "start"]