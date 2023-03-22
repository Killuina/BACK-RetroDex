import "../../../loadEnvironment";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import bcrypt from "bcryptjs";
import connectDatabase from "../../../database/connectDatabase";
import User from "../../../database/models/User";
import { type UserStructure, type UserLoginCredentials } from "../../types";
import { app } from "../..";
import statusCodes from "../../utils/statusCodes";
import { paths } from "../../utils/paths";

const {
  success: { okCode },
  clientError: { unauthorized },
} = statusCodes;

const {
  users: {
    endpoints: { login },
    usersPath,
  },
} = paths;

let mockMongoDbServer: MongoMemoryServer;

beforeAll(async () => {
  mockMongoDbServer = await MongoMemoryServer.create();

  const mongodbServerUrl = mockMongoDbServer.getUri();

  await connectDatabase(mongodbServerUrl);

  const userData: UserStructure = {
    username: "notDiana",
    password: await bcrypt.hash("12345678", 10),
    email: "notDiana@gmail.com",
  };
  await User.create(userData);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mockMongoDbServer.stop();
});

describe("Given the POST /users/login endpoint", () => {
  const userLoginCredentials: UserLoginCredentials = {
    username: "notDiana",
    password: "12345678",
  };

  describe("When it receives a request with a user with username 'notDiana' and password '12345678' and the user exists", () => {
    test("Then it should respond with status 200 and property token", async () => {
      const response = await request(app)
        .post(`${usersPath}${login}`)
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

      const response = await request(app)
        .post(`${usersPath}${login}`)
        .send(userLoginCredentialsWithWrongPassword)
        .expect(unauthorized);

      expect(response.body).toHaveProperty("error", expectedMessage);
    });
  });
});
