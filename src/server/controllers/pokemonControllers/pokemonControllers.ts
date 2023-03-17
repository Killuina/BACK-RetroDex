import { type NextFunction, type Request, type Response } from "express";
import mongoose from "mongoose";
import { CustomError } from "../../../CustomError/CustomError.js";
import UserPokemon, {
  type UserPokemonSchemaStructure,
} from "../../../database/models/UserPokemon.js";
import { type CustomRequest } from "../../types.js";
import statusCodes from "../../utils/statusCodes.js";

const {
  success: { okCode },
  serverError: { internalServer },
  clientError: { badRequest },
} = statusCodes;

export const getUserPokemon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pokemon = await UserPokemon.find().exec();
    if (pokemon.length === 0) {
      throw new CustomError(
        "There are no Pokemon on the database",
        internalServer,
        "Coudln't retreive Pokémon"
      );
    }

    res.status(okCode).json({ pokemon });
  } catch (error: unknown) {
    const getPokemonError = new CustomError(
      (error as Error).message,
      internalServer,
      "Couldn't retreive Pokémon"
    );

    next(getPokemonError);
  }
};

export const deleteUserPokemonById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userPokemonId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userPokemonId)) {
      throw new CustomError(
        "Invalid id",
        badRequest,
        "Please enter a valid Id"
      );
    }

    const deletedPokemon = await UserPokemon.findByIdAndDelete(
      userPokemonId
    ).exec();

    if (!deletedPokemon) {
      throw new CustomError(
        "The pokémon doesn't exist on the database",
        internalServer,
        "Error deleting pokémon"
      );
    }

    res.status(okCode).json({ message: `${deletedPokemon.name} deleted` });
  } catch (error: unknown) {
    next(error);
  }
};

export const createUserPokemon = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userPokemon = req.body as UserPokemonSchemaStructure;
  const { userId } = req;

  await UserPokemon.create({ ...userPokemon, createdBy: userId });
};
