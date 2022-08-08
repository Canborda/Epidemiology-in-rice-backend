import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import validatorMiddleware from '../middlewares/validator.middleware';

class GeeValidator {
  /**
   * This class validates the requests from MAP routes
   */

  public get(req: Request, res: Response, next: NextFunction) {
    // Define validator schema
    const schema = Joi.object({
      map_id: Joi.string().required(),
    });
    // Call validator middleware
    const error_msg = 'Error validating query params to get GEE image';
    validatorMiddleware(req, res, next, req.query, schema, error_msg);
  }
}

export default new GeeValidator();
