import { Router } from "express";
import {
  createUserPokemon,
  deleteUserPokemonById,
  getPokemonById,
  getAllUsersPokemonList,
  getUserPokemonList,
} from "../../controllers/pokemonControllers/pokemonControllers.js";
import auth from "../../middlewares/auth/auth.js";
import {
  backupImage,
  optimizeImage,
  uploadImage,
} from "../../middlewares/imageMiddlewares/imageMiddlewares.js";
import { paths } from "../../utils/paths.js";
import createUserPokemonValidation from "../../schemas/createUserPokemon.js";
import getUserPokemonValidation from "../../schemas/getUserPokemon.js";

const {
  pokemon: {
    endpoints: {
      deleteUserPokemon,
      createPokemon,
      getOnePokemon,
      getUserPokemon,
      editUserPokemon,
    },
  },
} = paths;

const pokemonRouter = Router();

pokemonRouter.get("/", getUserPokemonValidation, getAllUsersPokemonList);

pokemonRouter.get(
  getUserPokemon,
  getUserPokemonValidation,
  auth,
  getUserPokemonList
);
pokemonRouter.get(getOnePokemon, getPokemonById);

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

pokemonRouter.post(
  editUserPokemon,
  auth,
  uploadImage,
  createUserPokemonValidation,
  optimizeImage,
  backupImage,
  createUserPokemon
);

export default pokemonRouter;
