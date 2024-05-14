[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Killuina_BACK-pokedex&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Killuina_BACK-pokedex)

# POKÉDEX API

## POKÉDEX

This is an API Rest of custom Pokémon data build using Express and Node.js. Tested using Jest, MongoDb Memory Server and Supertest.

### **GET STARTED**

To use this app, you'll need to have the following tool installed:

**[Node.js](https://nodejs.org/en/)**

Once installed, you can clone this repository and install all needed dependencies.

You can start the development server by running first **`npm run build:dev`** to build and then **`npm run start`** to deploy, by default the server will deploy on **`http://localhost:3000/`**

### **TESTING**

This app uses Jest and React Testing Library for unit and integration tests. To run all test suites, use the **`npm test`** command.

If you want your test to be runned everytime you save, use **`npm run test:dev`**.

If you want to see your coverage, use **`npm run test:coverage`**

If you want to run only unit tests, use **`npm run test:unit`** and use **`npm run test:unit:dev`**

If you want to run only integration tests, use **`npm run test:integration`** and use **`npm run test:integration:dev`**

### **ENDPOINTS**

- [POST] Open endpoint to Log in: **/users/login**
- [POST] Open endpoint to register new user: **users/register**
- [GET] Open endpoint to get all user Pokémon on the database: **/pokemon**
- [GET] Open endpoint to get all user Pokémon on the database filtered by type: **/pokemon?type=""**
- [GET] Protected endpoint to get only logged user Pokémon: **/pokemon/user**
- [GET] Open endpoint to get all user Pokémon on the database filtered by type: **/pokemon?type=""**-
- [GET] Open endpoint to get one user Pokémon data: **/pokemon/:userPokemonId**
- [DELETE] Protected endpoint to delete one user Pokémon by its id: **/pokemon/delete/:userPokemonId**
- [POST] Protected endpoint to create one Pokémon. **/pokemon/create**
