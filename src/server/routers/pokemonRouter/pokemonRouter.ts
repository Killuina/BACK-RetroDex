import { Router } from "express";
import { getUserPokemon } from "../../controllers/pokemonControllers/pokemonControllers.js";

export const pokemonRouter = Router();

pokemonRouter.get("/", getUserPokemon);
