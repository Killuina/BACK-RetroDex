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
  pokemon: { pokemonPath },
} = paths;

const {
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
