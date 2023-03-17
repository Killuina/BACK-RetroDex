import { Joi, validate } from "express-validation";

const loginUserSchema = {
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const loginValidation = validate(loginUserSchema, {}, { abortEarly: false });

export default loginValidation;
