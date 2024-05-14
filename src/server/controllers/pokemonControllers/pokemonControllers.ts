import { type NextFunction, type Request, type Response } from "express";
import mongoose, { type FilterQuery, type UpdateQuery } from "mongoose";
import { CustomError } from "../../../CustomError/CustomError.js";
import UserPokemon from "../../../database/models/UserPokemon.js";
import {
  type UserPokemonData,
  type CustomRequest,
  type UserPokemonStructure,
} from "../../types.js";
import statusCodes from "../../utils/statusCodes.js";

const {
  success: { okCode, resourceCreated },
  serverError: { internalServer },
  clientError: { badRequest, conflict },
} = statusCodes;

export const getUserPokemonList = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);

    const userPokemonListQuery: FilterQuery<UserPokemonStructure> = {
      createdBy: userId,
    };

    if (req.query.type) {
      const pokemonType = req.query.type;

      userPokemonListQuery.$or = [
        { firstType: pokemonType },
        { secondType: pokemonType },
      ];
    }

    const pokemonList = await UserPokemon.find(userPokemonListQuery).populate({
      path: "createdBy",
      select: "username",
    });

    res.status(okCode).json({ pokemon: pokemonList });
  } catch (error) {
    const getPokemonError = new CustomError(
      (error as Error).message,
      internalServer,
      "Couldn't retreive Pokémon"
    );

    next(getPokemonError);
  }
};

export const getAllUsersPokemonList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const getAllUsersPokemonListQuery: FilterQuery<UserPokemonData> = {};

    if (req.query.type) {
      const pokemonType = req.query.type;

      getAllUsersPokemonListQuery.$or = [
        { firstType: pokemonType },
        { secondType: pokemonType },
      ];
    }

    const pokemonList = await UserPokemon.find(getAllUsersPokemonListQuery)
      .populate({
        path: "createdBy",
        select: "username",
      })
      .exec();

    res.status(okCode).json({ pokemon: pokemonList });
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
  try {
    const userPokemon = req.body as UserPokemonData;
    const { userId } = req;

    const newUserPokemon = await UserPokemon.create({
      ...userPokemon,
      createdBy: new mongoose.Types.ObjectId(userId),
    });

    res.status(resourceCreated).json({ pokemon: newUserPokemon });
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    const statusCode = errorMessage.includes("E11000")
      ? conflict
      : internalServer;
    const message = errorMessage.includes("E11000")
      ? "Name already exists"
      : "Error editing Pokémon";

    const createdUserPokemonError = new CustomError(
      errorMessage,
      statusCode,
      message
    );

    next(createdUserPokemonError);
  }
};

export const editUserPokemon = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userPokemon = req.body as UserPokemonData;

    const { userPokemonId } = req.params;

    const editedUserPokemon = await UserPokemon.findByIdAndUpdate(
      userPokemonId,
      userPokemon,
      {
        new: true,
      }
    );

    res.status(okCode).json({ pokemon: editedUserPokemon });
  } catch (error) {
    const errorMessage = (error as Error).message;
    const statusCode = errorMessage.includes("E11000")
      ? conflict
      : internalServer;
    const message = errorMessage.includes("E11000")
      ? "Name already exists"
      : "Error editing Pokémon";

    const editedUserPokemonError = new CustomError(
      errorMessage,
      statusCode,
      message
    );

    next(editedUserPokemonError);
  }
};

export const getPokemonById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { pokemonId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(pokemonId)) {
      throw new CustomError(
        "Invalid id",
        badRequest,
        "Please enter a valid Id"
      );
    }

    const pokemon = await UserPokemon.findById(pokemonId)
      .populate({
        path: "createdBy",
        select: "username",
      })
      .exec();

    if (!pokemon) {
      throw new CustomError(
        "Pokémon not found",
        internalServer,
        "Pokémon not found"
      );
    }

    res.status(200).json({ pokemon });
  } catch (error: unknown) {
    const getPokemonByIdError = new CustomError(
      (error as Error).message,
      internalServer,
      "Error finding your Pokémon"
    );

    next(getPokemonByIdError);
  }
};
