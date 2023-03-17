import { Router } from "express";
import {
  createUserPokemon,
  deleteUserPokemonById,
  getUserPokemon,
} from "../../controllers/pokemonControllers/pokemonControllers.js";
import auth from "../../middlewares/auth/auth.js";
import {
  backupImage,
  optimizeImage,
  uploadImage,
} from "../../middlewares/imageMiddlewares/imageMiddlewares.js";
import { paths } from "../../paths/paths.js";

const {
  pokemon: {
    endpoints: { deleteUserPokemon, createPokemon },
  },
} = paths;

export const pokemonRouter = Router();

pokemonRouter.get("/", getUserPokemon);
pokemonRouter.delete(deleteUserPokemon, auth, deleteUserPokemonById);
pokemonRouter.post(
  createPokemon,
  auth,
  uploadImage,
  optimizeImage,
  backupImage,
  createUserPokemon
);
