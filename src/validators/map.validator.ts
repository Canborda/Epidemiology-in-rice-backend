import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import validatorMiddleware from '../middlewares/validator.middleware';

class UserValidator {
  /**
   * This class validates the requests from MAP routes
   */

  public get(req: Request, res: Response, next: NextFunction) {
    // Define validator schema
    const schema = Joi.object({
      userId: Joi.string().min(24).max(24).required(),
      mapId: Joi.string().min(24).max(24),
    });
    // Call validator middleware
    const error_msg = 'Error validating query params to get user maps';
    validatorMiddleware(req, res, next, req.query, schema, error_msg);
  }

  public create(req: Request, res: Response, next: NextFunction) {
    // Define validator schema
    const schema = Joi.object({
      userId: Joi.string().min(24).max(24).required(),
      name: Joi.string().required(),
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
