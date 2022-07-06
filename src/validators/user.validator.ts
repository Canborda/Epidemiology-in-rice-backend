import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import validatorMiddleware from '../middlewares/validator.middleware';

class UserValidator {
  /**
   * This class validates the requests from USER routes
   */

  public login(req: Request, res: Response, next: NextFunction) {
    // Define validation schema
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
    // Call validator middleware
    const error_msg = 'Error validating body to login user';
    validatorMiddleware(req, res, next, req.body, schema, error_msg);
  }

  public register(req: Request, res: Response, next: NextFunction) {
    // Define validation schema
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      name: Joi.string().required(),
      country: Joi.string().max(3),
      avatar: Joi.string().uri().allow(null, ''),
    });
    // Call validator middleware
    const error_msg = 'Error validating body to register user';
    validatorMiddleware(req, res, next, req.body, schema, error_msg);
  }
}

export default new UserValidator();
