import path from "path";
import fs from "fs/promises";
import { type NextFunction, type Response } from "express";
import { type CustomRequest } from "../../types";
import { bucket, upload } from "./imageMiddlewaresConfigurations.js";
import sharp from "sharp";
import { CustomError } from "../../../CustomError/CustomError.js";
import statusCodes from "../../utils/statusCodes.js";

const {
  clientError: { badRequest, conflict },
} = statusCodes;

export const uploadImage = upload.single("image");

export const optimizeImage = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      next();
      return;
    }

    const pokemonImageName = req.file?.filename;

    const basePath = `${path.basename(
      pokemonImageName,
      path.extname(pokemonImageName)
    )}`;
    // If source image is .webp, no need to convert
    const imageDestinationPath =
      path.extname(pokemonImageName) === ".webp"
        ? path.join("uploads", basePath)
        : path.join("uploads", `${basePath}.webp`);

    await sharp(path.join("uploads", pokemonImageName))
      .resize(120, 120, { fit: "cover" })
      .webp({ quality: 100 })
      .toFile(imageDestinationPath);

    req.file.filename = `${basePath}.webp`;

    next();
  } catch (error: unknown) {
    const newError = new CustomError(
      (error as Error).message,
      badRequest,
      "Error optimizing the provided image"
    );
    next(newError);
  }
};

export const backupImage = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      next();
      return;
    }

    const pokemonImage = req.file?.filename;

    const pokemonImageUrl = path.join("uploads", pokemonImage);

    const backupPokemonImage = await fs.readFile(pokemonImageUrl);

    const { data, error } = await bucket.upload(
      pokemonImage,
      backupPokemonImage
    );

    if (!data) {
      throw new CustomError(
        error.message,
        conflict,
        "Error creating backup image"
      );
    }

    const {
      data: { publicUrl },
    } = bucket.getPublicUrl(pokemonImage);

    req.body.imageUrl = pokemonImageUrl;
    req.body.backupImageUrl = publicUrl;

    next();
  } catch (error) {
    next(error);
  }
};
