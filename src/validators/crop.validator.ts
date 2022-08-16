import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import validatorMiddleware from '../middlewares/validator.middleware';

class CropValidator {
  /**
   * This class validates the requests from CROP routes
   */

  public create(req: Request, res: Response, next: NextFunction) {
    // Define validation schema
    const schema = Joi.object({
      name: Joi.string().required(),
      variety: Joi.string().required(),
      phenology: Joi.object().required(),
      disseases: Joi.array().required(),
    });
    // Call validator middleware
    const error_msg = 'Error validating body to create crop';
    validatorMiddleware(req, res, next, req.body, schema, error_msg);
  }

  public update(req: Request, res: Response, next: NextFunction) {
    // Define validation schema
    const schema = Joi.object({
      phenology: Joi.object().optional(),
      disseases: Joi.array().optional(),
    });
    // Call validator middleware
    const error_msg = 'Error validating body to update crop';
    validatorMiddleware(req, res, next, req.body, schema, error_msg);
  }
}

export default new CropValidator();
