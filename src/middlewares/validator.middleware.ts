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
    const validated = schema.validate(obj, { abortEarly: false });
    if (validated.error) {
      throw new ValidationError(
        error_msg,
        validated.error.details.map(
          detail => `${detail.message}. Given value: ${detail.context?.value ?? 'null'}`,
        ),
      );
    }
    // Store validated object for controller
    res.locals.schema = validated.value;
    next();
  } catch (error) {
    next(error);
  }
}
