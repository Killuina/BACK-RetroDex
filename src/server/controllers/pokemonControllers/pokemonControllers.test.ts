import { type NextFunction, type Request, type Response } from "express";
import mongoose from "mongoose";
import { CustomError } from "../../../CustomError/CustomError";
import UserPokemon from "../../../database/models/UserPokemon";
import { mockPokemon } from "../../../mocks/pokemonMock";
import statusCodes from "../../utils/statusCodes";
import { deleteUserPokemonById, getUserPokemon } from "./pokemonControllers";

const {
  success: { okCode },
  serverError: { internalServer },
} = statusCodes;

beforeEach(() => jest.clearAllMocks());

describe("Given the pokemon controller", () => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const req: Partial<Request> = {};
  const next: NextFunction = jest.fn();

  describe("When it receives a request", () => {
    test("Then it should respond with a status code 200", async () => {
      UserPokemon.find = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue({}),
      }));

      await getUserPokemon(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(okCode);
    });

    test("Then it should respond with property pokemon assigned to an empty object", async () => {
      const expectedEmptyObject = { pokemon: {} };

      UserPokemon.find = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue({}),
      }));

      await getUserPokemon(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith(expectedEmptyObject);
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

      await getUserPokemon(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given the deleteUserPokemonById controller", () => {
  const expectedResponseBody = {
    message: `${mockPokemon.name} deleted`,
  };
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const req: Partial<Request> = {
    params: { userPokemonId: mockPokemon.id },
  };
  const next: NextFunction = jest.fn();

  describe("When it receives a request to delete 'Pokamion'", () => {
    test("Then it should call its status method with 200", async () => {
      mongoose.Types.ObjectId.isValid = () => true;

      UserPokemon.findByIdAndDelete = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(mockPokemon),
      }));

      await deleteUserPokemonById(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(okCode);
    });

    test("Then it should call its json method with message: 'Pokamion deleted'", async () => {
      UserPokemon.findByIdAndDelete = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(mockPokemon),
      }));

      await deleteUserPokemonById(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith(expectedResponseBody);
    });
  });

  describe("When it receives a request and the deleting process fails", () => {
    test("Then it should call the received next function with the created error", async () => {
      const error = new Error("Error deleting Pokémon");

      mongoose.Types.ObjectId.isValid = () => true;

      UserPokemon.findByIdAndDelete = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockRejectedValue(error),
      }));

      await deleteUserPokemonById(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("When it receives an invalid id", () => {
    test("Then it should call next function with an error with message 'Please enter a valid Id'", async () => {
      const expectedErrorMessage = "Please enter a valid Id";

      mongoose.Types.ObjectId.isValid = () => false;

      await deleteUserPokemonById(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ publicMessage: expectedErrorMessage })
      );
    });
  });
});
