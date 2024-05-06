import "../../../loadEnvironment";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import mongoose from "mongoose";
import { app } from "../..";
import jwt from "jsonwebtoken";
import connectDatabase from "../../../database/connectDatabase";
import { mockUserPokemon } from "../../../mocks/pokemonMocks";
import { paths } from "../../utils/paths";
import statusCodes from "../../utils/statusCodes";
import UserPokemon from "../../../database/models/UserPokemon";
import { PokemonTypes } from "../../controllers/pokemonControllers/types";
import { type CustomJwtPayload } from "../../controllers/userControllers/types";
import User from "../../../database/models/User";
import { mockUserCredentials } from "../../../mocks/userMocks";

const setupTestAuthorizationData = async () => {
  const { _id, username } = await User.create(mockUserCredentials);

  const jwtPayload: CustomJwtPayload = {
    sub: _id.toString(),
    username,
  };

  const token = jwt.sign(jwtPayload, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  const authorizationHeader = `Bearer ${token}`;

  const noBearerAuthorizationHeader = "";

  return {
    authorizationHeader,
    noBearerAuthorizationHeader,
    userId: _id,
  };
};

const {
  pokemon: {
    pokemonPath,
    endpoints: { createPokemon, getUserPokemon },
  },
} = paths;

const {
  clientError: { badRequest, forbbiden, conflict },
  success: { okCode, resourceCreated },
  serverError: { internalServer },
} = statusCodes;

let mockMongodbServer: MongoMemoryServer;

beforeAll(async () => {
  mockMongodbServer = await MongoMemoryServer.create();
  const mongodbServerUrl = mockMongodbServer.getUri();

  await connectDatabase(mongodbServerUrl);
  await UserPokemon.create(mockUserPokemon);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mockMongodbServer.stop();
});

afterEach(async () => {
  await UserPokemon.deleteMany();
  await User.deleteMany();
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

  describe("When it receives a request to filter by type 'Water' and there is one Pokemon on the database that matches", () => {
    test("Then it should respond with okCode and a list with the requested pokemon", async () => {
      await UserPokemon.create(mockUserPokemon);

      const expectedListLength = 1;
      const response = await request(app)
        .get(pokemonPath)
        .query({ type: PokemonTypes.water })
        .expect(okCode);

      expect(response.body).toHaveProperty("pokemon");
      expect(response.body.pokemon).toHaveLength(expectedListLength);
    });
  });
});

describe("Given the GET /pokemon/users endoint", () => {
  describe("When it receives a request and theres pokemon created by the user on DDBB", () => {
    test("Then it should respond with okCode and the requested list of Pokemon", async () => {
      const expectedListLength = 1;
      const { authorizationHeader, userId } =
        await setupTestAuthorizationData();

      await UserPokemon.create({ ...mockUserPokemon, createdBy: userId });

      const response = await request(app)
        .get(`${pokemonPath}${getUserPokemon}`)
        .set("Authorization", authorizationHeader)
        .expect(okCode);

      expect(response.body).toHaveProperty("pokemon");
      expect(response.body.pokemon).toHaveLength(expectedListLength);
    });
  });

  describe("When it receives a request with filter 'Water' and theres pokemon created by the user on DDBB", () => {
    test("Then it should respond with okCode and the requested list of Pokemon", async () => {
      const expectedListLength = 1;
      const { authorizationHeader, userId } =
        await setupTestAuthorizationData();

      await UserPokemon.create({ ...mockUserPokemon, createdBy: userId });

      const response = await request(app)
        .get(`${pokemonPath}${getUserPokemon}`)
        .query({ type: PokemonTypes.water })
        .set("Authorization", authorizationHeader)
        .expect(okCode);

      expect(response.body).toHaveProperty("pokemon");
      expect(response.body.pokemon).toHaveLength(expectedListLength);
    });
  });
});

describe("Given the DELETE /pokemon/:userPokemonId endpoint", () => {
  describe("When it receives a request to delete 'Pokamion'", () => {
    test("Then it should respond with okCode and message: 'Pokamion' deleted", async () => {
      const { _id: id } = await UserPokemon.create(mockUserPokemon);
      const { authorizationHeader } = await setupTestAuthorizationData();

      const deletePokamionEndpoint = `${pokemonPath}/delete/${id.toString()}`;

      const response = await request(app)
        .delete(deletePokamionEndpoint)
        .set("Authorization", authorizationHeader)
        .expect(okCode);

      expect(response.body).toHaveProperty(
        "message",
        `${mockUserPokemon.name} deleted`
      );
    });

    describe("When it receives a request to delete a pokémon that doesn't exists", () => {
      test("Then it should respond with internalServer code and message: 'Error deleting pokémon'", async () => {
        const { authorizationHeader } = await setupTestAuthorizationData();

        const expectedErrorMessage = "Error deleting pokémon";
        const nonExistingPokemonId = "640f22f29ef06cb2185232e3";

        const deleteNonExistingPokemonEndpoint = `${pokemonPath}/delete/${nonExistingPokemonId}`;

        const response = await request(app)
          .delete(deleteNonExistingPokemonEndpoint)
          .set("Authorization", authorizationHeader)
          .expect(internalServer);

        expect(response.body).toHaveProperty("error", expectedErrorMessage);
      });
    });

    describe("When it receives a request with an invalid id", () => {
      test("Then it should respond with badRequest code and message 'Please enter a valid Id'", async () => {
        const { authorizationHeader } = await setupTestAuthorizationData();
        const expectedErrorMessage = "Please enter a valid Id";
        const invalidPokemonId = "123";

        const deleteinvalidIdPokemonEndpoint = `/pokemon/delete/${invalidPokemonId}`;

        const response = await request(app)
          .delete(deleteinvalidIdPokemonEndpoint)
          .set("Authorization", authorizationHeader)
          .expect(badRequest);

        expect(response.body).toHaveProperty("error", expectedErrorMessage);
      });
    });

    const invalidTokenMessage = "Action not allowed";
    const deleteMockPokemonEndpoint = `${pokemonPath}/delete/640f22f29ef06cb2185232e3`;

    describe("When it receives a request without header Authorization", () => {
      test("Then it should respond with error 'Invalid token'", async () => {
        const response = await request(app)
          .delete(deleteMockPokemonEndpoint)
          .expect(forbbiden);

        expect(response.body).toHaveProperty("error", invalidTokenMessage);
      });
    });

    describe("When it receives a request with header Authorization without bearer", () => {
      test("Then it should respond with error 'Invalid token'", async () => {
        const { noBearerAuthorizationHeader } =
          await setupTestAuthorizationData();

        const response = await request(app)
          .delete(deleteMockPokemonEndpoint)
          .set("Authorization", noBearerAuthorizationHeader)
          .expect(forbbiden);

        expect(response.body).toHaveProperty("error", invalidTokenMessage);
      });
    });
  });
});

describe("Given a POST /pokemon/create endpoint", () => {
  describe("When it receives a request with all needed data to create a Pokemon named 'Pokamion", () => {
    test("Then it should respond with resource created status code and all Pokamion data, including its name'", async () => {
      const { authorizationHeader } = await setupTestAuthorizationData();

      const response = await request(app)
        .post(`${pokemonPath}${createPokemon}`)
        .set("Authorization", authorizationHeader)
        .field("name", mockUserPokemon.name)
        .field("ability", mockUserPokemon.ability)
        .field("firstType", mockUserPokemon.types[0])
        .field("secondType", mockUserPokemon.types[1])
        .field("height", mockUserPokemon.height)
        .field("weight", mockUserPokemon.weight)
        .field("baseExp", mockUserPokemon.baseExp)
        .attach("image", "testMedia/test.png")
        .expect(resourceCreated);

      expect(response.body).toHaveProperty(
        "pokemon",
        expect.objectContaining({ name: mockUserPokemon.name })
      );
    });
  });

  describe("When it receives a request with no name field", () => {
    test("Then it should respond with status 400 and message: 'Validation Failed'", async () => {
      const { authorizationHeader } = await setupTestAuthorizationData();
      const expectedError = "Validation Failed";

      const response = await request(app)
        .post(`${pokemonPath}${createPokemon}`)
        .set("Authorization", authorizationHeader)
        .field("ability", mockUserPokemon.ability)
        .field("firstType", mockUserPokemon.types[0])
        .field("secondType", mockUserPokemon.types[1])
        .field("height", mockUserPokemon.height)
        .field("weight", mockUserPokemon.weight)
        .field("baseExp", mockUserPokemon.baseExp)
        .attach("image", "testMedia/test.png")
        .expect(badRequest);

      expect(response.body).toHaveProperty("error", expectedError);
    });
  });

  describe("When it receives a request with a name that already exists in the database", () => {
    test("Then it should respond with bad requests status and message: 'Name already exists'", async () => {
      const { authorizationHeader } = await setupTestAuthorizationData();

      await UserPokemon.create(mockUserPokemon);

      const expectedError = "Name already exists";

      const response = await request(app)
        .post(`${pokemonPath}${createPokemon}`)
        .field("name", mockUserPokemon.name)
        .set("Authorization", authorizationHeader)
        .field("ability", mockUserPokemon.ability)
        .field("firstType", mockUserPokemon.types[0])
        .field("secondType", mockUserPokemon.types[1])
        .field("height", mockUserPokemon.height)
        .field("weight", mockUserPokemon.weight)
        .field("baseExp", mockUserPokemon.baseExp)
        .attach("image", "testMedia/test.png")
        .expect(conflict);

      expect(response.body).toHaveProperty("error", expectedError);
    });
  });
});

describe("Given the GET /pokemon/:pokemonId endpoint", () => {
  describe("When it receives a request to get 'Pokamion' details", () => {
    test("Then it should respond with okCode and all 'Pokamion' data", async () => {
      const { _id: id } = await UserPokemon.create(mockUserPokemon);

      const getPokamionEndpoint = `${pokemonPath}/${id.toString()}`;
      const response = await request(app)
        .get(getPokamionEndpoint)
        .expect(okCode);

      expect(response.body).toHaveProperty("pokemon", {
        ...mockUserPokemon,
        id: id.toString(),
      });
    });
  });

  describe("When it receives a request to get 'Pokamion' info but the finding process fails", () => {
    test("Then the response body should include status code 500 and error message 'Error finding your Pokémon'", async () => {
      const getPokamionEndpoint = `${pokemonPath}/640f22f29ef06cb2185232e3`;

      const expectedErrorMessage = "Error finding your Pokémon";

      const response = await request(app)
        .get(getPokamionEndpoint)
        .expect(internalServer);

      expect(response.body).toHaveProperty("error", expectedErrorMessage);
    });
  });
});
