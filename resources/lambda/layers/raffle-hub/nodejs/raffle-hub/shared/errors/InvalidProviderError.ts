import BaseError from './BaseError';

export class InvalidProviderError extends BaseError {
  constructor(message = 'Invalid provider error') {
    super(message);
    this.name = this.constructor.name;
  }
}
