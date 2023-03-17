import { type NextFunction, type Response } from "express";
import fs from "fs/promises";
import { mockPokemonData } from "../../../mocks/pokemonMocks";
import { type CustomRequest } from "../../types";
import { backupImage } from "./imageMiddlewares";
import { bucket } from "./imageMiddlewaresConfigurations";

const mockFilePath = "uploads/image.jpg";

const mockFile: Partial<Express.Multer.File> = { filename: "pokemon.png" };

const mockReq = {
  body: mockPokemonData,
  file: mockFile as Express.Multer.File,
};
const mockRes: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
const mockNext: NextFunction = jest.fn();

beforeEach(() => jest.resetAllMocks());

describe("Given the backupImage", () => {
  describe("When it receives a request with pokemon data and a file 'pokemon.png'", () => {
    fs.readFile = jest.fn().mockResolvedValue(mockFilePath);

    test("Then it should call next function", async () => {
      bucket.upload = jest.fn().mockResolvedValue({
        data: mockFilePath,
        error: null,
      });

      bucket.getPublicUrl = jest.fn().mockReturnValue({
        data: { publicUrl: mockFilePath },
      });

      await backupImage(
        mockReq as CustomRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("When it receives a request with pokemon data and a file 'pokemon.png', and the upload process fails", () => {
    test("Then it should call next function with the error thrown by upload process", async () => {
      const expectedError = new Error("Upload failed");

      bucket.upload = jest.fn().mockResolvedValue({
        data: null,
        error: expectedError,
      });

      await backupImage(
        mockReq as CustomRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expectedError);
    });
  });
});
