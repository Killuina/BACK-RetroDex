import { type PokemonData, type UserPokemonStructure } from "../server/types";

export const mockUserPokemon: UserPokemonStructure = {
  id: "640f22f29ef06cb2185232e3",
  name: "Pokamion",
  types: ["Pesao"],
  ability: "Pesao",
  height: 0,
  weight: 0,
  baseExp: 0,
  imageUrl: "/pokamion.png",
  backupImageUrl:
    "http/whvdnqxlctrpqnppjuwd.supabase.co/storage/v1/object/public/pokemon/pokamion.webp",
  createdBy: "63fa113cda52dff29b261e0a",
};

export const mockPokemonData: PokemonData = {
  id: "640f22f29ef06cb2185232e3",
  name: "Pokamion",
  types: ["Pesao"],
  ability: "Pesao",
  height: 0,
  weight: 0,
  baseExp: 0,
};
