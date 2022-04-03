export default class BaseError extends Error {
  readonly statusCode: number;
  constructor(message = 'Unknown error', statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}
