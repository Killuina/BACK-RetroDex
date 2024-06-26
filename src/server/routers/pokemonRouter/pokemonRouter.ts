import { Router } from "express";
import {
  createUserPokemon,
  deleteUserPokemonById,
  getPokemonById,
  getAllUsersPokemonList,
  getUserPokemonList,
  editUserPokemon,
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
import editUserPokemonValidation from "../../schemas/editUserPokemon.js";

const {
  pokemon: {
    endpoints: {
      deleteUserPokemon,
      createPokemon,
      getOnePokemon,
      getUserPokemon,
      editPokemon,
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

pokemonRouter.put(
  editPokemon,
  auth,
  uploadImage,
  editUserPokemonValidation,
  optimizeImage,
  backupImage,
  editUserPokemon
);

export default pokemonRouter;
