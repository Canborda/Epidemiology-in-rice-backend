import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import validatorMiddleware from '../middlewares/validator.middleware';

class UserValidator {
  /**
   * This class validates the requests from MAP routes
   */

  public create(req: Request, res: Response, next: NextFunction) {
    // Define validator schema
    const schema = Joi.object({
      crop: Joi.string().required(),
      name: Joi.string().required(),
      seedDate: Joi.date().iso().required(),
      polygon: Joi.array()
        .items(
          Joi.array()
            .ordered(Joi.number().min(-180).max(180).required(), Joi.number().min(-90).max(90).required())
            .required(),
        )
        .min(3)
        .required(),
    });
    // Call validator middleware
    const error_msg = 'Error validating body to create map';
    validatorMiddleware(req, res, next, req.body, schema, error_msg);
  }
}

export default new UserValidator();
