import { type Request } from "express";
import type mongoose from "mongoose";

export interface UserLoginCredentials {
  password: string;
  username: string;
}

export interface UserCredentials extends UserLoginCredentials {
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

export interface UserPokemonData {
  id: string;
  name: string;
  firstType: string;
  secondType: string;
  ability: string;
  height: number;
  weight: number;
  baseExp: number;
}

export interface UserId {
  id: string;
}
export interface CustomRequest extends Request {
  userId: string;
}
