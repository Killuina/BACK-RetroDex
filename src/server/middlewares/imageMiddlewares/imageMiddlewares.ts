import "../../../loadEnvironment";
import path from "path";
import fs from "fs/promises";
import { type NextFunction, type Response } from "express";
import { type CustomRequest } from "../../types";
import { bucket, upload } from "./imageMiddlewaresConfigurations";

export const uploadImage = upload.single("image");

export const backupImage = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const pokemonImage = req.file?.filename;

    const pokemonImageUrl = path.join("/uploads", pokemonImage!);

    const backupPokemonImage = await fs.readFile(pokemonImageUrl);

    await bucket.upload(pokemonImage!, backupPokemonImage);

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
