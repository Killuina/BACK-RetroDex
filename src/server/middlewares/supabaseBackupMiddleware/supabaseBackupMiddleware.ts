import path from "path";
import fs from "fs/promises";
import { createClient } from "@supabase/supabase-js";
import { type NextFunction, type Response } from "express";
import { type CustomRequest } from "../../types";
import { supabaseId, supabaseKey, supabaseUrl } from "../../../loadEnvironment";

const supabase = createClient(supabaseUrl!, supabaseKey!);

const supabaseBackUp = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const pokemonImage = req.file?.filename;

    const pokemonImageUrl = path.join("/uploads", pokemonImage!);

    const backupPokemonImage = await fs.readFile(pokemonImageUrl);

    await supabase.storage
      .from(supabaseId!)
      .upload(pokemonImage!, backupPokemonImage);

    const {
      data: { publicUrl },
    } = supabase.storage.from(supabaseId!).getPublicUrl(pokemonImage!);

    req.body.imageUrl = pokemonImageUrl;
    req.body.backupImageUrl = publicUrl;

    next();
  } catch (error) {
    next(error);
  }
};

export default supabaseBackUp;
