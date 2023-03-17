import { Joi, validate } from "express-validation";

const createUserPokemonSchema = {
  body: Joi.object({
    name: Joi.string().max(11).required(),
    ability: Joi.string().max(11).required(),
    firstType: Joi.string().required(),
    secondType: Joi.string().optional(),
    height: Joi.number().max(500).required(),
    weight: Joi.number().max(1000).required(),
    baseExp: Joi.number().max(300).required(),
  }),
};

const createUserPokemonValidation = validate(
  createUserPokemonSchema,
  {},
  { abortEarly: false }
);

export default createUserPokemonValidation;
