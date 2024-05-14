[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Killuina_BACK-pokedex&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Killuina_BACK-pokedex)

# POKÉDEX API

## POKÉDEX

This is an API Rest of custom Pokémon data build using Express and Node.js. Tested using Jest, MongoDb Memory Server and Supertest.

## ENDPOINTS

- [POST] Open endpoint to Log in: **/users/login**
- [POST] Open endpoint to register new user: **users/register**
- [GET] Open endpoint to get all user Pokémon on the database: **/pokemon**
- [GET] Open endpoint to get all user Pokémon on the database filtered by type: **/pokemon?type=""**
- [GET] Protected endpoint to get only logged user Pokémon: **/pokemon/user**
- [GET] Open endpoint to get all user Pokémon on the database filtered by type: **/pokemon?type=""**-
- [GET] Open endpoint to get one user Pokémon data: **/pokemon/:userPokemonId**
- [DELETE] Protected endpoint to delete one user Pokémon by its id: **/pokemon/delete/:userPokemonId**
- [POST] Protected endpoint to create one Pokémon. **/pokemon/create**
