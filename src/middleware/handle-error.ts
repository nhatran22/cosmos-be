import Errors from "../errors/errors";

export const handleError = (error: any): Errors => { // eslint-disable-line
  if (error instanceof Errors) {
    return error;
  }

  return Errors.INTERNAL_ERROR;
};
