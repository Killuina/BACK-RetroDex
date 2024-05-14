import { Joi, validate } from "express-validation";

const editUserPokemonSchema = {
  body: Joi.object({
    name: Joi.string().max(11),
    ability: Joi.string().max(11),
    firstType: Joi.string(),
    secondType: Joi.string(),
    height: Joi.string().max(3),
    weight: Joi.string().max(3),
    baseExp: Joi.string().max(3),
  }),
};

const editUserPokemonValidation = validate(
  editUserPokemonSchema,
  {},
  { abortEarly: false }
);

export default editUserPokemonValidation;
