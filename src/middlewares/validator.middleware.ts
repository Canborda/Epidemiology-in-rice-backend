import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { ValidationError } from '../utils/errors';

export default function (
  req: Request,
  res: Response,
  next: NextFunction,
  obj: object,
  schema: Joi.ObjectSchema,
  error_msg: string,
) {
  try {
    // Validate request
    const validated = schema.validate(obj);
    if (validated.error) {
      throw new ValidationError(error_msg, [
        validated.error.details[0].message,
        validated.error.details[0].context?.value
          ? `Given value: ${validated.error.details[0].context?.value}`
          : `No value given`,
      ]);
    }
    // Store validated object for controller
    res.locals.schema = validated.value;
    next();
  } catch (error) {
    next(error);
  }
}
