import { Joi, validate } from "express-validation";

const getUserPokemonSchema = {
  query: Joi.object({
    createdBy: Joi.string(),
    type: Joi.string(),
  }),
};

const getUserPokemonValidation = validate(getUserPokemonSchema, {});

export default getUserPokemonValidation;
