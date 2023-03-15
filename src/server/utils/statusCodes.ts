const statusCodes = {
  clientError: { notFound: 400, badRequest: 400, unauthorized: 401, gone: 401 },
  serverError: {
    internalServer: 500,
  },
  success: { okCode: 200 },
};

export default statusCodes;
