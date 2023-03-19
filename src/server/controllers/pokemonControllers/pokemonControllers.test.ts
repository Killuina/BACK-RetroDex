import { type NextFunction, type Request, type Response } from "express";
import mongoose from "mongoose";
import { mock } from "node:test";
import { CustomError } from "../../../CustomError/CustomError";
import UserPokemon from "../../../database/models/UserPokemon";
import { mockUserPokemon } from "../../../mocks/pokemonMocks";
import { type CustomRequest } from "../../types";
import statusCodes from "../../utils/statusCodes";
import {
  createUserPokemon,
  deleteUserPokemonById,
  getUserPokemon,
} from "./pokemonControllers";

const {
  success: { okCode, resourceCreated },
  serverError: { internalServer },
} = statusCodes;

beforeEach(() => jest.clearAllMocks());

describe("Given the getUserPokemon controller", () => {
  const mockRes: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const mockReq: Partial<Request> = {};
  const mockNext: NextFunction = jest.fn();

  describe("When it receives a request", () => {
    test("Then it should respond with a status code 200", async () => {
      UserPokemon.find = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue({}),
      }));

      await getUserPokemon(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(okCode);
    });

    test("Then it should respond with property pokemon assigned to an empty object", async () => {
      const expectedEmptyObject = { pokemon: {} };

      UserPokemon.find = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue({}),
      }));

      await getUserPokemon(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith(expectedEmptyObject);
    });
  });

  describe("when there's an error when getting Pokemon from the database", () => {
    test("Then it should call the function Next with the expected error", async () => {
      const expectedError = new CustomError(
        "Couldn't retreive Pokemon",
        internalServer,
        "Couldn't retreive Pokemon"
      );

      UserPokemon.find = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockRejectedValue(expectedError),
      }));

      await getUserPokemon(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given the deleteUserPokemonById controller", () => {
  const expectedResponseBody = {
    message: `${mockUserPokemon.name} deleted`,
  };
  const mockRes: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const mockReq: Partial<Request> = {
    params: { userPokemonId: mockUserPokemon.id },
  };
  const mockNext: NextFunction = jest.fn();

  describe("When it receives a request to delete 'Pokamion'", () => {
    test("Then it should call its status method with 200", async () => {
      mongoose.Types.ObjectId.isValid = () => true;

      UserPokemon.findByIdAndDelete = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(mockUserPokemon),
      }));

      await deleteUserPokemonById(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(okCode);
    });

    test("Then it should call its json method with message: 'Pokamion deleted'", async () => {
      UserPokemon.findByIdAndDelete = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(mockUserPokemon),
      }));

      await deleteUserPokemonById(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.json).toHaveBeenCalledWith(expectedResponseBody);
    });
  });

  describe("When it receives a request and the deleting process fails", () => {
    test("Then it should call the received next function with message 'Error deleting pokemon'", async () => {
      const expectedErrorMessage = "Error deleting pokémon";

      mongoose.Types.ObjectId.isValid = () => true;

      UserPokemon.findByIdAndDelete = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(null),
      }));

      await deleteUserPokemonById(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ publicMessage: expectedErrorMessage })
      );
    });
  });

  describe("When it receives an invalid id", () => {
    test("Then it should call next function with an error with message 'Please enter a valid Id'", async () => {
      const expectedErrorMessage = "Please enter a valid Id";

      mongoose.Types.ObjectId.isValid = () => false;

      await deleteUserPokemonById(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ publicMessage: expectedErrorMessage })
      );
    });
  });
});

describe("Given the createUserPokemon controller", () => {
  const mockUserId = "640f22f29ef06cb2185232e3";

  const mockRes: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const mockReq: Partial<CustomRequest> = {
    body: mockUserPokemon,
    userId: mockUserId,
  };
  const mockNext: NextFunction = jest.fn();

  describe("When it receives a request with a Pokémon named 'Pokamion', and all data necesary to create it", () => {
    UserPokemon.create = jest.fn().mockResolvedValue({
      ...mockUserPokemon,
      id: "640f22f29ef06cb2185232e4",
    });

    test("Then it should call its status method with resourceCreated code", async () => {
      await createUserPokemon(
        mockReq as CustomRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(resourceCreated);
    });

    test("Then it should call its json method with property pokemon with all Pokamion data", async () => {
      const expectedResponseBody = {
        pokemon: {
          ...mockUserPokemon,
          id: "640f22f29ef06cb2185232e4",
        },
      };

      await createUserPokemon(
        mockReq as CustomRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.json).toHaveBeenCalledWith(expectedResponseBody);
    });

    describe("When it receives a request with a Pokémon and the creating on the database process fails", () => {
      test("Then it should call the received next function with an error with message 'Error creating the Pokémon on the database'", async () => {
        const expectedError = new Error(
          "Error creating the Pokémon on the database"
        );

        UserPokemon.create = jest.fn().mockRejectedValue(expectedError);

        await createUserPokemon(
          mockReq as CustomRequest,
          mockRes as Response,
          mockNext
        );

        expect(mockNext).toHaveBeenCalledWith(
          expect.objectContaining({ message: expectedError.message })
        );
      });
    });
  });
});
