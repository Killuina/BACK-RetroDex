import { type NextFunction, type Request, type Response } from "express";
import mongoose from "mongoose";
import { CustomError } from "../../../CustomError/CustomError.js";
import UserPokemon from "../../../database/models/UserPokemon.js";
import { type UserPokemonData, type CustomRequest } from "../../types.js";
import statusCodes from "../../utils/statusCodes.js";
import { type UserPokemonListQuery } from "./types.js";

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

    const userPokemonListQuery: UserPokemonListQuery = {
      createdBy: userId,
    };

    if (req.query.type && typeof req.query.type === "string") {
      userPokemonListQuery.types = req.query.type;
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
    const pokemonList = req.query.type
      ? await UserPokemon.find({ types: req.query.type })
          .populate({
            path: "createdBy",
            select: "username",
          })
          .exec()
      : await UserPokemon.find()
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
      types: [userPokemon.firstType, userPokemon.secondType],
      createdBy: new mongoose.Types.ObjectId(userId),
    });

    res.status(resourceCreated).json({ pokemon: newUserPokemon });
  } catch (error: unknown) {
    const creatingPokemonError = (error as Error).message.includes("E11000")
      ? new CustomError(
          (error as Error).message,
          conflict,
          "Name already exists"
        )
      : new CustomError(
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
