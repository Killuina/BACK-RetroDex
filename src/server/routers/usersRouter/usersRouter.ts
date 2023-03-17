import { Router } from "express";
import { loginUser } from "../../controllers/userControllers/userControllers.js";
import { paths } from "../../paths/paths.js";
import loginValidation from "../../schemas/loginUserSchema.js";

const {
  users: {
    endpoints: { login },
  },
} = paths;

const usersRouter = Router();

usersRouter.post(login, loginValidation, loginUser);

export default usersRouter;
