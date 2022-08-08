export class BaseError extends Error {
  public code: number;
  public details: Array<string>;
  constructor(message: string) {
    super(message);
    this.name = 'Base Error';
    this.details = [];
    this.code = 500;
  }
}

export class InternalError extends BaseError {
  constructor(error: Error) {
    super(error.message);
    this.name = 'Internal Error';
    this.details = [error.stack!];
    this.code = 500;
  }
}

export class ValidationError extends BaseError {
  constructor(message: string, details: Array<string>) {
    super(message);
    this.name = 'Validation Error';
    this.details = details;
    this.code = 400;
  }
}

export class ExistenceError extends BaseError {
  constructor(message: string, params: object) {
    super(message);
    this.name = 'Existence Error';
    this.details = Object.entries(params).map(param => param.join(': '));
    this.code = 400;
  }
}

export class NonExistenceError extends BaseError {
  constructor(message: string, params: object) {
    super(message);
    this.name = 'Non-Existence Error';
    this.details = Object.entries(params).map(param => param.join(': '));
    this.code = 400;
  }
}

export class AuthenticationError extends BaseError {
  constructor(message: string, details: string = '') {
    super(message);
    this.name = 'Authentication Error';
    this.details = details ? [details] : [];
    this.code = 403;
  }
}
