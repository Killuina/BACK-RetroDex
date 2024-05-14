[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Killuina_BACK-pokedex&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Killuina_BACK-pokedex)

# RETRODEX API

## RETRODEX

Welcome to RetroDex API, your gateway to a world of custom Pokémon data. Built using **Express.js** with **TypeScript** and **Node.js**, RetroDex API provides a reliable and efficient RESTful interface for managing Pokémon data. From creating and updating Pokémon to retrieving detailed information, RetroDex API empowers developers to interact seamlessly with Pokémon data.

Rigorously tested using **Jest**, **MongoDb Memory Server**, and **Supertest**, RetroDex API guarantees reliability and consistency in every operation.

With a robust pipeline implemented through **GitHub Actions** and **Husky Hooks**, RetroDex API enforces consistency in commits and branches, conducts thorough testing, maintains clean code practices, and generates reports via SonarCloud. This ensures the protection of the main branch and the overall integrity of the codebase.

### **GET STARTED**

To use this app, you'll need to have the following tool installed:

**[Node.js](https://nodejs.org/en/)**

Once installed, you can clone this repository and install all needed dependencies.

You can start the development server by running first **`npm run build:dev`** to build and then **`npm run start`** to deploy, by default the server will deploy on **`http://localhost:4321/`**

### **TESTING**

This app uses Jest and SuperTest for unit and integration tests. To run all test suites, use the **`npm test`** command.

If you want your test to be runned everytime you save, use **`npm run test:dev`**.

If you want to see your coverage, use **`npm run test:coverage`**

If you want to run only unit tests, use **`npm run test:unit`** and use **`npm run test:unit:dev`**

If you want to run only integration tests, use **`npm run test:integration`** and use **`npm run test:integration:dev`**

### **ENDPOINTS**

- [POST] Open endpoint to Log in: **`/users/login`**
- [POST] Open endpoint to register new user: **`users/register`**
- [GET] Open endpoint to get all user Pokémon on the database: **`/pokemon`**
- [GET] Open endpoint to get all user Pokémon on the database filtered by type: **`/pokemon?type=""`**
- [GET] Protected endpoint to get only logged user Pokémon: **`/pokemon/user`**
- [GET] Open endpoint to get all user Pokémon on the database filtered by type: **`/pokemon?type=""`**
- [GET] Open endpoint to get one user Pokémon data: **`/pokemon/:userPokemonId`**
- [DELETE] Protected endpoint to delete one user Pokémon by its id: **`/pokemon/delete/:userPokemonId`**
- [POST] Protected endpoint to create one Pokémon **`/pokemon/create`**
- [PUT] Protected endpoint to edit one Pokémon **`/pokemon/edit/:userPokemonId`**
