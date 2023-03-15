export interface Paths {
  users: {
    usersPath: string;
    endpoints: {
      login: string;
    };
  };
  pokemon: {
    pokemonPath: string;
    endpoints: { deleteUserPokemon: string };
  };
}
