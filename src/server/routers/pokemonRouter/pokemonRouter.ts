import { Router } from "express";
import {
  deleteUserPokemonById,
  getUserPokemon,
} from "../../controllers/pokemonControllers/pokemonControllers.js";

export const pokemonRouter = Router();

pokemonRouter.get("/", getUserPokemon);
pokemonRouter.delete("/delete/:userPokemonId", deleteUserPokemonById);
