import "../../../loadEnvironment";
import path from "path";
import fs from "fs/promises";
import { type NextFunction, type Response } from "express";
import { type CustomRequest } from "../../types";
import { bucket } from "./imageMiddlewaresConfigurations";
import sharp from "sharp";
import { CustomError } from "../../../CustomError/CustomError";
import statusCodes from "../../utils/statusCodes";

const {
  clientError: { badRequest },
} = statusCodes;

export const optimizeImage = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const pokemonImageOriginalName = req.file?.originalname;
  const pokemonImageName = req.file?.filename;

  const basePath = `${path.basename(
    pokemonImageOriginalName!,
    path.extname(pokemonImageOriginalName!)
  )}`;

  try {
    await sharp(path.join("uploads", pokemonImageName!))
      .resize(120, 120, { fit: "cover" })
      .webp({ quality: 100 })
      .toFile(path.join("uploads", `${basePath}.webp`));

    req.file!.filename = `${basePath}.webp`;

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
    const pokemonImage = req.file?.filename;

    const pokemonImageUrl = path.join("/uploads", pokemonImage!);

    const backupPokemonImage = await fs.readFile(pokemonImageUrl);

    const { data, error } = await bucket.upload(
      pokemonImage!,
      backupPokemonImage
    );

    if (!data) {
      throw error;
    }

    const {
      data: { publicUrl },
    } = bucket.getPublicUrl(pokemonImage!);

    req.body.imageUrl = pokemonImageUrl;
    req.body.backupImageUrl = publicUrl;

    next();
  } catch (error) {
    next(error);
  }
};
