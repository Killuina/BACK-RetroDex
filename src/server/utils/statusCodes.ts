interface StatusCodes {
  clientError: {
    conflict: number;
    notFound: number;
    badRequest: number;
    unauthorized: number;
    gone: number;
    forbbiden: number;
  };
  serverError: {
    internalServer: number;
  };
  success: { okCode: number; resourceCreated: number };
}

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
