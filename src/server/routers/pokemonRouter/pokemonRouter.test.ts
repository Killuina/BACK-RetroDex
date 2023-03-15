import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import mongoose from "mongoose";
import { app } from "../..";
import connectDatabase from "../../../database/connectDatabase";
import { mockPokemon } from "../../../mocks/pokemonMock";
import { paths } from "../../paths/paths";
import statusCodes from "../../utils/statusCodes";
import UserPokemon from "../../../database/models/UserPokemon";

const {
  pokemon: {
    pokemonPath,
    endpoints: { deleteUserPokemon },
  },
} = paths;

const {
  clientError: { badRequest },
  success: { okCode },
  serverError: { internalServer },
} = statusCodes;

let mongodbServer: MongoMemoryServer;

beforeAll(async () => {
  mongodbServer = await MongoMemoryServer.create();
  const mongodbServerUrl = mongodbServer.getUri();

  await connectDatabase(mongodbServerUrl);
  await UserPokemon.create(mockPokemon);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongodbServer.stop();
});

afterEach(async () => {
  await UserPokemon.deleteMany();
});

describe("Given the GET /pokemon endpoint", () => {
  describe("When it receives a request and there is one Pokemon on the database", () => {
    test("Then it should respond with okCode and the requested list of Pokemon", async () => {
      const expectedListLength = 1;
      const response = await request(app).get(pokemonPath).expect(okCode);

      expect(response.body).toHaveProperty("pokemon");
      expect(response.body.pokemon).toHaveLength(expectedListLength);
    });
  });

  describe("When it receives a request and there are no pokemon in the database", () => {
    beforeEach(async () => {
      await UserPokemon.deleteMany();
    });

    test("Then the response body should include status code 500 and error message 'Couldn't retreive Pokemon", async () => {
      const expectedErrorMessage = {
        error: "Couldn't retreive Pokémon",
      };

      const response = await request(app)
        .get(pokemonPath)
        .expect(internalServer);

      expect(response.body).toStrictEqual(expectedErrorMessage);
    });
  });
});

describe("Given the DELETE /pokemon/:userPokemonId endpoint", () => {
  describe("When it receives a request to delete 'Pokamion'", () => {
    test("Then it should respond with okCode and message: 'Pokamion' deleted", async () => {
      const { _id: id } = await UserPokemon.create(mockPokemon);

      const deletePokamionEndpoint = `/pokemon/delete/${id.toString()}`;

      const response = await request(app)
        .delete(deletePokamionEndpoint)
        .expect(okCode);

      expect(response.body).toHaveProperty(
        "message",
        `${mockPokemon.name} deleted`
      );
    });

    describe("When it receives a request to delete a pokémon that doesn't exists", () => {
      test("Then it should respond with internalServer code and message: 'Error deleting pokémon'", async () => {
        const expectedErrorMessage = "Error deleting pokémon";
        const nonExistingPokemonId = "640f22f29ef06cb2185232e3";

        const deleteNonExistingPokemonEndpoint = `/pokemon/delete/${nonExistingPokemonId}`;

        const response = await request(app)
          .delete(deleteNonExistingPokemonEndpoint)
          .expect(internalServer);

        expect(response.body).toHaveProperty("error", expectedErrorMessage);
      });
    });

    describe("When it receives a request with an invalid id", () => {
      test("Then it should respond with badRequest code and message 'Please enter a valid Id'", async () => {
        const expectedErrorMessage = "Please enter a valid Id";
        const invalidPokemonId = "123";

        const deleteinvalidIdPokemonEndpoint = `/pokemon/delete/${invalidPokemonId}`;

        const response = await request(app)
          .delete(deleteinvalidIdPokemonEndpoint)
          .expect(badRequest);

        expect(response.body).toHaveProperty("error", expectedErrorMessage);
      });
    });
  });
});
