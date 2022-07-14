import { NextFunction, Request, Response } from 'express';

import { BaseError, InternalError } from '../utils/errors';

export default (err: Error, req: Request, res: Response, next: NextFunction) => {
  // Type error
  const typedError: BaseError = toTypedError(err);
  console.log(`New ERROR type ${typedError.name}.`);
  // Send error response
  res.status(typedError.code || 500).json({
    error: typedError.name,
    message: typedError.message,
    details: typedError.details,
  });
};

const toTypedError = (error: Error) => {
  return error instanceof BaseError ? error : new InternalError(error.message || 'Unknown internal error');
};
