[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=isdi-coders-2023_Cristina-Jimenez-Final-Project-back-202301-bcn&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=isdi-coders-2023_Cristina-Jimenez-Final-Project-back-202301-bcn)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=isdi-coders-2023_Cristina-Jimenez-Final-Project-back-202301-bcn&metric=coverage)](https://sonarcloud.io/summary/new_code?id=isdi-coders-2023_Cristina-Jimenez-Final-Project-back-202301-bcn)

# POKÉDEX API

## POKÉDEX

This is an API Rest of userss Pokémon data build using Express and Node.js. Tested using Jest, MongoDb Memory Server and Supertest.

## ENDPOINTS

- [POST] Open endpoint to Log in: **/users/login**
- [GET] Open endpoint to get all user Pokémon on the database: **/pokemon**
- [GET] Open endpoint to get all user Pokémon on the database filtered by type: **/pokemon?type=""**
- [GET] Open endpoint to get one user Pokémon data: **/pokemon/:userPokemonId**
- [DELETE] Protected endpoint to delete one user Pokémon by its id: **/pokemon/delete/:userPokemonId**
- [POST] Protected endpoint to create one Pokémon. **/pokemon/create**
