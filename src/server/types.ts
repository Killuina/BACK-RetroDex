import { type Request } from "express";

export interface UserLoginCredentials {
  password: string;
  username: string;
}

export interface UserStructure extends UserLoginCredentials {
  email: string;
}

export interface UserPokemonStructure {
  id: string;
  name: string;
  types: string[];
  ability: string;
  height: number;
  weight: number;
  baseExp: number;
  imageUrl: string;
  backupImageUrl: string;
  createdBy: string;
}

export type PokemonData = Pick<
  UserPokemonStructure,
  "id" | "name" | "types" | "ability" | "height" | "weight" | "baseExp"
>;

export interface UserId {
  id: string;
}
export interface CustomRequest extends Request {
  userId: string;
}
