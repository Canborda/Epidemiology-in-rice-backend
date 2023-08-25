import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { VarietyI } from '../models/dtos/variety.model';

import validatorMiddleware from '../middlewares/validator.middleware';

class VarietyValidator {
  /**
   * Validates the request bodies from VARIETY routes.
   */

  public create(req: Request, res: Response, next: NextFunction) {
    // Define validation schema
    const schema = Joi.object<VarietyI>({
      name: Joi.string().required(),
    });
    // Call validator middleware
    const error_msg = 'Error validating body to create variety';
    validatorMiddleware(req, res, next, req.body, schema, error_msg);
  }

  public update(req: Request, res: Response, next: NextFunction) {
    // Define validation schema
    const schema = Joi.object<VarietyI>({
      name: Joi.string().required(),
    });
    // Call validator middleware
    const error_msg = 'Error validating body to update variety';
    validatorMiddleware(req, res, next, req.body, schema, error_msg);
  }
}

export default new VarietyValidator();
