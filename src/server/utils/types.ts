export interface Paths {
  users: {
    usersPath: string;
    endpoints: {
      login: string;
      register: string;
    };
  };
  pokemon: {
    pokemonPath: string;
    endpoints: {
      deleteUserPokemon: string;
      createPokemon: string;
      getOnePokemon: string;
    };
  };
}

export interface StatusCodes {
  clientError: {
    conflict: number;
    notFound: number;
    badRequest: number;
    unauthorized: number;
    gone: number;
    forbbiden: number;
  };
  serverError: {
    internalServer: number;
  };
  success: { okCode: number; resourceCreated: number };
}
