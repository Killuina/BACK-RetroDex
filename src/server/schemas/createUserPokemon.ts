import { Joi, validate } from "express-validation";

const createUserPokemonSchema = {
  body: Joi.object({
    name: Joi.string().max(11).required(),
    ability: Joi.string().max(11).required(),
    firstType: Joi.string().required(),
    secondType: Joi.string().required(),
    height: Joi.string().max(3).required(),
    weight: Joi.string().max(3).required(),
    baseExp: Joi.string().max(3).required(),
  }),
};

const createUserPokemonValidation = validate(
  createUserPokemonSchema,
  {},
  { abortEarly: false }
);

export default createUserPokemonValidation;
