import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import validatorMiddleware from '../middlewares/validator.middleware';

class UserValidator {
  /**
   * This class validates the requests from USER routes
   */

  public register(req: Request, res: Response, next: NextFunction) {
    // Define validator schema
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      name: Joi.string().required(),
      country: Joi.string().max(3),
      avatar: Joi.string().uri().allow(null, ''),
    });
    // Call validator middleware
    const error_msg = 'Error validating body to register login';
    validatorMiddleware(req, res, next, req.body, schema, error_msg);
  }
}

export default new UserValidator();
