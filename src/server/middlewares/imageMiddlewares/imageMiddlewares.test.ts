import { type NextFunction, type Response } from "express";
import fs from "fs/promises";
import { mockPokemonData } from "../../../mocks/pokemonMocks";
import { type CustomRequest } from "../../types";
import { backupImage, optimizeImage } from "./imageMiddlewares";
import { bucket } from "./imageMiddlewaresConfigurations";

let mockToFile = jest.fn().mockReturnThis();

jest.mock("sharp", () => () => ({
  resize: jest.fn().mockReturnThis(),
  webp: jest.fn().mockReturnValue({ toFile: mockToFile }),
}));

const mockFilePath = "uploads/image.jpg";

const mockFile: Partial<Express.Multer.File> = {
  filename: "pokemon",
  originalname: "pokemon.png",
};

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

describe("Given the backupImage middleware", () => {
  describe("When it receives a request with pokemon data and a file 'pokemon.png'", () => {
    fs.readFile = jest.fn().mockResolvedValue(mockFilePath);

    test("Then it should call the received next function", async () => {
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

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ message: expectedError.message })
      );
    });
  });
});

describe("Given the optimizeImage middleware", () => {
  describe("When it receives a request with pokemon data and a file 'pokemon.png'", () => {
    test("Then it should call the received next function and put the optimized image on the", async () => {
      const expectedOptimizedImageName = "pokemon.webp";

      await optimizeImage(
        mockReq as CustomRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.file.filename).toBe(expectedOptimizedImageName);
    });
  });

  describe("When it receives a request with pokemon data and a file 'pokemon.png' and the optimizing process fails", () => {
    test("Then it should call the received next function with rejected error", async () => {
      const expectedError = new Error("Optimization failed");

      mockToFile = jest.fn().mockRejectedValue(expectedError);

      await optimizeImage(
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
