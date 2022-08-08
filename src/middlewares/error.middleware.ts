import { NextFunction, Request, Response } from 'express';

import { BaseError, InternalError } from '../utils/errors';

export default (err: Error, req: Request, res: Response, next: NextFunction) => {
  // Type error
  const typedError: BaseError = err instanceof BaseError ? err : new InternalError(err);
  console.log(`New ERROR type ${typedError.name}.`);
  // Send error response
  res.status(typedError.code || 500).json({
    error: typedError.name,
    message: typedError.message,
    details: typedError.details,
  });
};
