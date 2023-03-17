import {
  type UserPokemonData,
  type UserPokemonStructure,
} from "../server/types";

export const mockUserPokemon: UserPokemonStructure = {
  id: "640f22f29ef06cb2185232e3",
  name: "Pokamion",
  types: ["Pesao", "MuPesao"],
  ability: "Pesao",
  height: 0,
  weight: 0,
  baseExp: 0,
  imageUrl: "/pokamion.png",
  backupImageUrl:
    "http/whvdnqxlctrpqnppjuwd.supabase.co/storage/v1/object/public/pokemon/pokamion.webp",
  createdBy: "63fa113cda52dff29b261e0a",
};

export const mockPokemonData: UserPokemonData = {
  id: "640f22f29ef06cb2185232e3",
  name: "Pokamion",
  firstType: "Pesao",
  secondType: "Pesao",
  ability: "Pesao",
  height: 0,
  weight: 0,
  baseExp: 0,
};
