import mongoose from "mongoose";
import request from "supertest";
import bcrypt from "bcryptjs";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectDatabase from "../../../database/connectDatabase";
import User from "../../../database/models/User";
import { type UserStructure, type UserLoginCredentials } from "../../types";
import { app } from "../..";
import statusCodes from "../../utils/statusCodes";
import { paths } from "../../paths/paths";

const {
  success: { okCode },
  clientError: { unauthorized },
} = statusCodes;

let mockMongoDbServer: MongoMemoryServer;

beforeAll(async () => {
  mockMongoDbServer = await MongoMemoryServer.create();

  const mongodbServerUrl = mockMongoDbServer.getUri();

  await connectDatabase(mongodbServerUrl);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mockMongoDbServer.stop();
});

beforeAll(async () => {
  const userData: UserStructure = {
    username: "notDiana",
    password: await bcrypt.hash("12345678", 10),
    email: "notDiana@gmail.com",
  };
  await User.create(userData);
});

describe("Given the POST /users/login endpoint", () => {
  const userLoginCredentials: UserLoginCredentials = {
    username: "notDiana",
    password: "12345678",
  };

  describe("When it receives a request with a user with username 'notDiana' and password '12345678' and the user exists", () => {
    test("Then it should respond with status 200 and property token with value 'mocken'", async () => {
      const path = "/users/login";

      const response = await request(app)
        .post(path)
        .send(userLoginCredentials)
        .expect(okCode);

      expect(response.body).toHaveProperty("token");
    });
  });

  describe("When it receives a request with a user with username 'notDiana' and password '123456789888' and the password isnt correct", () => {
    test("Then it should respond with status 401 and error: 'Wrong Credentials'", async () => {
      const userLoginCredentialsWithWrongPassword: UserLoginCredentials = {
        username: "notDiana",
        password: "123456789888",
      };
      const expectedMessage = "Wrong credentials";
      const path = `${paths.users.path}${paths.users.endpoints.login}`;

      const response = await request(app)
        .post(path)
        .send(userLoginCredentialsWithWrongPassword)
        .expect(unauthorized);

      expect(response.body).toHaveProperty("error", expectedMessage);
    });
  });
});
