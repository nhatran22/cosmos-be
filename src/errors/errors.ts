export default class Errors {
  errorCode: number;
  errorMessage: string;

  constructor(errorCode: number, errorMessage: string) {
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
  }

  static get PARAMETER_ERROR() {
    return new Errors(10, "Parameter Error");
  }

  static get DATA_NOT_FOUND() {
    return new Errors(20, "Data not found");
  }

  static get INTERNAL_ERROR() {
    return new Errors(901, "Internal Error");
  }
}
