import { type NextFunction, type Request, type Response } from "express";
import { CustomError } from "../../../CustomError/CustomError";
import UserPokemon from "../../../database/models/UserPokemon";
import { mockUserPokemon } from "../../../mocks/pokemonMocks";
import { type CustomRequest } from "../../types";
import statusCodes from "../../utils/statusCodes";
import {
  createUserPokemon,
  deleteUserPokemonById,
  getPokemonById,
  getUserPokemonList,
} from "./pokemonControllers";

const {
  success: { okCode, resourceCreated },
  serverError: { internalServer },
} = statusCodes;

beforeEach(() => jest.clearAllMocks());

describe("Given the getUserPokemonList controller", () => {
  const mockRes: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const mockReq: Partial<Request> = {
    query: {
      types: "",
    },
  };
  const mockNext: NextFunction = jest.fn();

  const totalPokemon = 1;

  describe("When it receives a request", () => {
    test("Then it should respond with a status code 200", async () => {
      UserPokemon.find = jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockUserPokemon),
          }),
        }),
      });

      UserPokemon.countDocuments = jest.fn().mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(totalPokemon),
      }));

      await getUserPokemonList(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(okCode);
    });

    test("Then it should respond with property pokemon assigned to 'Pokamion'", async () => {
      UserPokemon.find = jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockUserPokemon),
          }),
        }),
      });

      UserPokemon.countDocuments = jest.fn().mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(totalPokemon),
      }));

      await getUserPokemonList(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.json).toHaveBeenCalledWith({
        pokemon: mockUserPokemon,
        totalPokemon,
      });
    });
  });

  describe("when there's an error when getting Pokemon from the database", () => {
    test("Then it should call the function Next with the expected error", async () => {
      const expectedError = new CustomError(
        "Couldn't retreive Pokemon",
        internalServer,
        "Couldn't retreive Pokemon"
      );

      UserPokemon.find = jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            exec: jest.fn().mockRejectedValue(expectedError),
          }),
        }),
      });

      UserPokemon.countDocuments = jest.fn().mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(totalPokemon),
      }));

      await getUserPokemonList(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request to filter by type 'Water'", () => {
    test("The it should respond with status 200 and all pokemon with type water", async () => {
      mockReq.query!.type = "Water";

      UserPokemon.find = jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockUserPokemon),
          }),
        }),
      });

      UserPokemon.countDocuments = jest.fn().mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(totalPokemon),
      }));

      await getUserPokemonList(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(okCode);
      expect(mockRes.json).toHaveBeenCalledWith({
        pokemon: mockUserPokemon,
        totalPokemon,
      });
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
    const mockReq: Partial<Request> = {
      params: { userPokemonId: "123" },
    };

    test("Then it should call next function with an error with message 'Please enter a valid Id'", async () => {
      const expectedErrorMessage = "Please enter a valid Id";

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

describe("Given a getPokemonById controller", () => {
  const mockRes: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const mockReq: Partial<Request> = {
    params: { pokemonId: mockUserPokemon.id },
  };
  const mockNext: NextFunction = jest.fn();

  describe("When it receives a request to get a Pokemon by id", () => {
    test("Then it should call its status method with a status 200 ", async () => {
      UserPokemon.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(mockUserPokemon),
      }));

      await getPokemonById(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(okCode);
    });

    test("Then it should respond with the requested Pokémon, 'Pokamion'", async () => {
      UserPokemon.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(mockUserPokemon),
      }));

      await getPokemonById(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({ pokemon: mockUserPokemon });
    });
  });

  describe("When it the finding pokemon process fails", () => {
    test("Then it should call its next method with an error message: 'Error finding your pokemon' and status 500", async () => {
      UserPokemon.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(undefined),
      }));

      await getPokemonById(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ publicMessage: "Error finding your Pokémon" })
      );
    });
  });

  describe("When it receives an invalid id", () => {
    const mockReq: Partial<Request> = {
      params: { pokemonId: "123" },
    };

    test("Then it should call next function with an error with message 'Invalid Id'", async () => {
      const expectedErrorMessage = "Invalid id";

      await getPokemonById(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ message: expectedErrorMessage })
      );
    });
  });
});
