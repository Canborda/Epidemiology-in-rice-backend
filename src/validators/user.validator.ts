import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import validatorMiddleware from '../middlewares/validator.middleware';

class UserValidator {
  public login(req: Request, res: Response, next: NextFunction) {
    console.log('INSIDE USER LOGIN VALIDATOR');
    // Call validator middleware
    const error_msg = 'Error validating body to login user';
    validatorMiddleware(req, res, next);
  }

  public register(req: Request, res: Response, next: NextFunction) {
    console.log('INSIDE USER REGISTER VALIDATOR');
    // Call validator middleware
    const error_msg = 'Error validating body to register login';
    validatorMiddleware(req, res, next);
  }
}

export default new UserValidator();
