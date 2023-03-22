import { type StatusCodes } from "./types";

const statusCodes: StatusCodes = {
  clientError: {
    conflict: 409,
    notFound: 400,
    badRequest: 400,
    unauthorized: 401,
    gone: 401,
    forbbiden: 403,
  },
  serverError: {
    internalServer: 500,
  },
  success: { okCode: 200, resourceCreated: 201 },
};

export default statusCodes;
