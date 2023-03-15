import { Router } from "express";
import {
  deleteUserPokemonById,
  getUserPokemon,
} from "../../controllers/pokemonControllers/pokemonControllers.js";
import { paths } from "../../paths/paths.js";

const {
  pokemon: {
    endpoints: { deleteUserPokemon },
  },
} = paths;

export const pokemonRouter = Router();

pokemonRouter.get("/", getUserPokemon);
pokemonRouter.delete(deleteUserPokemon, deleteUserPokemonById);
