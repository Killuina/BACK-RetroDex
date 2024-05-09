import { type Paths } from "./types";

export const paths: Paths = {
  users: {
    usersPath: "/users",
    endpoints: {
      login: "/login",
      register: "/register",
    },
  },

  pokemon: {
    pokemonPath: "/pokemon",
    endpoints: {
      getUserPokemon: "/user",
      deleteUserPokemon: "/delete/:userPokemonId",
      createPokemon: "/create",
      getOnePokemon: "/:pokemonId",
      editUserPokemon: "edit/:userPokemonId",
    },
  },
};
