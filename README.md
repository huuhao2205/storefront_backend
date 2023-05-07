#### Create a database.json ####
```
{
  "dev": {
    "driver": "pg",
    "host": "127.0.0.1",
    "database": { "ENV": "POSTGRES_DB" },
    "user": { "ENV": "POSTGRES_USER" },
    "password": { "ENV": "POSTGRES_PASSWORD" }
  },
  "test": {
    "driver": "pg",
    "host": "127.0.0.1",
    "database": { "ENV": "POSTGRES_TEST_DB" },
    "user": { "ENV": "POSTGRES_USER" },
    "password": { "ENV": "POSTGRES_PASSWORD" }
}
}
```
## Environment Variable ##

```
# default env
ENV=dev

# PostgreSQL database for dev
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=storefront
POSTGRES_USER=postgres
POSTGRES_PASSWORD="YOUR PASSWORD"

# database for testing
POSTGRES_TEST_DB=storefront_test

# password encryption
SALT_ROUNDS=10
PEPPER="YOUR STRING"

# JWT
TOKEN_SECRET="YOUR STRING"

```
## Installing dependencies ##

```
npm install
```

## Run server ##

Terminal:

```
npm run start
```

The default port is 3000

## Scripts ##


#### Transpiling typescript to javascript ####

```
npm run build
```

It wil transpile from Typescript to Javascirpt and copy the "views" folder to "build" folder. The transpiled code will be in the "build" folder.

#### Testing ####

```
npm run test
```

#### Prettier ####

```
npm run prettier
```

#### Linting ####

```
npm run lint
```
#### Watcher ####

```
npm run watch
```
## How to use##

The API offers several endpoints to access and manipulate data in the database through both CRUD and custom actions.

Check the REQUIREMENTS.md file to see the details.
---
