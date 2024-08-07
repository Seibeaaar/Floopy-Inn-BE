export const generateErrorMesaage = (e: unknown) => {
  if (e instanceof Error) {
    return e.message;
  }
  return "Something went wrong";
};

export const checkIfValidationError = (e: unknown) => {
  if (e instanceof Error) {
    return e.name === "SequelizeValidationError";
  }
  return false;
};
