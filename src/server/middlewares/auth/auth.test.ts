import { type Response } from "express";
import jwt from "jsonwebtoken";
import { type CustomRequest, type UserId } from "../../types";
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
      const userId: UserId = {
        id: "1234",
      };

      jwt.verify = jest.fn().mockReturnValue(userId);

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
