import { type NextFunction, type Request, type Response } from "express";
import mongoose from "mongoose";
import { CustomError } from "../../../CustomError/CustomError.js";
import UserPokemon from "../../../database/models/UserPokemon.js";
import { type UserPokemonData, type CustomRequest } from "../../types.js";
import statusCodes from "../../utils/statusCodes.js";
import { PokemonTypes } from "./types.js";

const {
  success: { okCode, resourceCreated },
  serverError: { internalServer },
  clientError: { badRequest },
} = statusCodes;

export const getUserPokemonList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pagination = {
      limit: 4,
      page: +req.query.page! || 0,
    };

    let pokemonList;

    if (req.query.type) {
      pokemonList = await UserPokemon.find({ types: req.query.type })
        .limit(pagination.limit)
        .skip(pagination.limit * pagination.page)
        .exec();
    } else {
      pokemonList = await UserPokemon.find()
        .limit(pagination.limit)
        .skip(pagination.limit * pagination.page)
        .exec();
    }

    const totalPokemon = await UserPokemon.countDocuments().exec();

    res.status(okCode).json({ pokemon: pokemonList, totalPokemon });
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
      types: [userPokemon.firstType, userPokemon.secondType],
      createdBy: userId,
    });

    res.status(resourceCreated).json({ pokemon: newUserPokemon });
  } catch (error: unknown) {
    const creatingPokemonError = new CustomError(
      (error as Error).message,
      internalServer,
      "Error creating Pokémon"
    );

    next(creatingPokemonError);
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

    const pokemon = await UserPokemon.findById({
      _id: pokemonId,
    }).exec();

    if (!pokemon) {
      throw new CustomError(
        "Pokémon not found",
        internalServer,
        "Error finding your Pokémon"
      );
    }

    res.status(200).json({ pokemon });
  } catch (error: unknown) {
    const getPokemonById = new CustomError(
      (error as Error).message,
      internalServer,
      "Error finding your Pokémon"
    );

    next(getPokemonById);
  }
};
