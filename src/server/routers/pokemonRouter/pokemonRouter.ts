import { Router } from "express";
import {
  createUserPokemon,
  deleteUserPokemonById,
  getPokemonById,
  getUserPokemon,
} from "../../controllers/pokemonControllers/pokemonControllers.js";
import auth from "../../middlewares/auth/auth.js";
import {
  backupImage,
  optimizeImage,
  uploadImage,
} from "../../middlewares/imageMiddlewares/imageMiddlewares.js";
import { paths } from "../../paths/paths.js";
import createUserPokemonValidation from "../../schemas/createUserPokemon.js";

const {
  pokemon: {
    endpoints: { deleteUserPokemon, createPokemon, getOnePokemon },
  },
} = paths;

export const pokemonRouter = Router();

pokemonRouter.get("/", getUserPokemon);
pokemonRouter.delete(deleteUserPokemon, auth, deleteUserPokemonById);
pokemonRouter.post(
  createPokemon,
  auth,
  uploadImage,
  createUserPokemonValidation,
  optimizeImage,
  backupImage,
  createUserPokemon
);
pokemonRouter.get(getOnePokemon, getPokemonById);
