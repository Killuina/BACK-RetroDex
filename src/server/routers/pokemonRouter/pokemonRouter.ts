import { Router } from "express";
import {
  deleteUserPokemonById,
  getUserPokemon,
} from "../../controllers/pokemonControllers/pokemonControllers.js";
import auth from "../../middlewares/auth/auth.js";
import { paths } from "../../paths/paths.js";

const {
  pokemon: {
    endpoints: { deleteUserPokemon, createUserPokemon },
  },
} = paths;

export const pokemonRouter = Router();

pokemonRouter.get("/", getUserPokemon);
pokemonRouter.delete(deleteUserPokemon, auth, deleteUserPokemonById);
