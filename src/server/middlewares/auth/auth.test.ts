import { type Response } from "express";
import jwt from "jsonwebtoken";
import { type CustomJwtPayload } from "../../controllers/userControllers/types";
import { type CustomRequest } from "../../types";
import auth from "./auth";

const mockRes: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
const mockReq: Partial<CustomRequest> = {
  header: jest.fn().mockReturnValue("Bearer mocken"),
};
const mockNext = jest.fn();

beforeEach(() => jest.clearAllMocks());

describe("Given the auth middleware", () => {
  describe("When it receives a request with an authorization header", () => {
    test("Then it should call the received next function", () => {
      const tokenPayload: CustomJwtPayload = {
        sub: "1234",
        username: "",
      };

      jwt.verify = jest.fn().mockReturnValue(tokenPayload);

      auth(mockReq as CustomRequest, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("When it receives a request withouth Authorization header ''", () => {
    test("Then it should respond with error message 'Authorization header is missing'", () => {
      const mockReq: Partial<CustomRequest> = {
        header: jest.fn().mockReturnValue(""),
      };
      const errorMessage = "Authorization header is missing";

      auth(mockReq as CustomRequest, mockRes as Response, mockNext);

      expect(mockNext.mock.calls[0][0]).toHaveProperty("message", errorMessage);
    });
  });

  describe("When it receives a request without Bearer in Authorization header", () => {
    test("Then it should respond with error 'No Bearer in authorization header'", () => {
      const mockReq: Partial<CustomRequest> = {
        header: jest.fn().mockReturnValue("mocken"),
      };
      const message = "No Bearer in authorization header";

      auth(mockReq as CustomRequest, mockRes as Response, mockNext);

      expect(mockNext.mock.calls[0][0]).toHaveProperty("message", message);
    });
  });
});
