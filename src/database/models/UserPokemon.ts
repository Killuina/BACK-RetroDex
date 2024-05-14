import { type InferSchemaType, model, Schema } from "mongoose";

const userPokemonSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxLength: 12,
    unique: true,
  },
  firstType: {
    type: String,
    required: true,
  },
  secondType: {
    type: String,
    required: true,
  },
  ability: {
    type: String,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  baseExp: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  backupImageUrl: {
    type: String,
  },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
});

const UserPokemon = model("UserPokemon", userPokemonSchema, "userPokemon");

export type UserPokemonSchemaStructure = InferSchemaType<
  typeof userPokemonSchema
>;

export default UserPokemon;
