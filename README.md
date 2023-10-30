# Awesome Project Built with TypeORM

This is a backend developed using Node.js, Express, Typescript and TypeORM

## Setup

This section explains how to get the app running. In order to run the app on your development environment you need to get [Docker and docker compose](https://docs.docker.com/get-docker/) installed first.
After installing and configuring docker and docker compose open a terminal at the project's root directory and follow the setup guide.

### 1. Enviroment variables
Set ENV variables if running the app for the first time by running the command `cp .env.example .env` (default values work but can be changed as needed)

### 2. Database Migrations
If running the app for the first time, run migrations to create the database tables by running the command `make db-migrate`

### 3. Start Application Containers
Having all setup, start all containers by running the command `make up`

### 4. Ready 🚀
The app should be listening at [localhost:3000](http://localhost:3000)

## API DOCS

Api Docs should be available at [localhost:3000/docs](http://localhost:3000/docs)

## Tests

To run tests run the command `make test` and it should print the coverage details.



