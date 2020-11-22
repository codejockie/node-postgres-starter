# TypeScript Node Postgres Starter

> A starter project for Node.js using Express and Postgres

## Setup

Pre-requisites:

- Docker for Desktop

Run `docker-compose up -f docker-compose.yml` in the root of the project.

It will bring up Postgres and the Express application server in development mode.

It binds the application server to `localhost:4000`, this can be re-mapped this by changing the first 4000 in `4000:4000` of [./docker-compose.yml](./docker-compose.yml)).

Postgres is exposed on port `5432`. The connection string is `postgres://user:pass@localhost:5432/db` (username, password and database name are defined in [./docker-compose.yml](./docker-compose.yml)).

You can connect to Postgres using the psql client:

```sh
psql postgres://user:pass@localhost:5432/db
```

The default Docker `CMD` is `npm start`, [./docker-compose.yml](./docker-compose.yml) overrides this to `yarn dev` which runs the application using nodemon (auto-restart on file change).


## Express API setup

The Express API is located in [./src/api](./src/api).

Applications routes for resources are defined in [./src/api/index.js](./src/api/index.js).

Global concerns like security, cookie parsing, body parsing and request logging are handled in [./server.js](./server.js).

This application loosely follows the [Presentation Domain Data Layering](https://www.martinfowler.com/bliki/PresentationDomainDataLayering.html):

- Presentation is dealt with in the `./src/api` directory
- Domain is dealt with in the `./src/modules` directory. It's currently non-existent since we've only got generic user and session resources.
- Data is dealt with in the `./src/data` directory

## Database setup + management

`yarn migrate up` will run the migrations.

`yarn migrate down` will roll back the migrations.

`yarn migrate:create <migration-name>`  will create a new migration file in [./src/migrations](./src/migrations).

To run the migrations inside of docker-compose. Which will run a bash instance inside the `app` container.
```sh
docker-compose run app bash
```

Followed by:
```sh
yarn migrate up
```

## Session/Authentication management

Session management is done through a custom sessions table, `/api/session` endpoints (see [./src/api/session.js](./src/api/session.js)) and leveraging [client-sessions](https://github.com/mozilla/node-client-sessions).
