# Awesome Project Built with TypeORM

This is a simple backend developed using Node.js, Express, Typescript and TypeORM

## Setup

This section explains how to get the app running. In order to run the app on your development environment you need to get [Docker and docker compose](https://docs.docker.com/get-docker/) installed first. 

### 1. Set ENV variables if running for the first name by executing `cp .env.example .env` on terminal at the project root directory.

### 2. Start all containers by running the command `make up` on terminal at the project root directory.

### 3. Having all containers up and running, if running the app for the first time, run the migration to create the database by executing `make db-migrate`

### 4. The app should be listening at [localhost:3000](http://localhost:3000)

## API DOCS

Api Docs should be available at [localhost:3000/docs](http://localhost:3000/docs)

## Tests

To run test run the command `make test` at it should print the coverage details



