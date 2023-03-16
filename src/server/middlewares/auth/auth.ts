import jwt from "jsonwebtoken";
import { type Response, type NextFunction } from "express";
import { type UserId, type CustomRequest } from "../../types";
import { CustomError } from "../../../CustomError/CustomError.js";
import statusCodes from "../../utils/statusCodes.js";

const {
  clientError: { forbbiden },
} = statusCodes;

const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.header("Authorization");

    if (!authorizationHeader) {
      throw new Error("Authorization header is missing");
    }

    if (!authorizationHeader.startsWith("Bearer ")) {
      throw new Error("No Bearer in authorization header");
    }

    const token = authorizationHeader.replace(/^Bearer\s*/, "");

    const { id } = jwt.verify(token, process.env.JWT_SECRET!) as UserId;
    req.userId = id;

    next();
  } catch (error: unknown) {
    const authError = new CustomError(
      (error as Error).message,
      forbbiden,
      "Action not allowed"
    );

    next(authError);
  }
};

export default auth;
