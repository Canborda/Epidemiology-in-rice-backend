import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { PhenologyI } from '../models/dtos/phenology.model';

import validatorMiddleware from '../middlewares/validator.middleware';

class PhenologyValidator {
  /**
   * Validates the request bodies or query_params from PHENOLOGY routes.
   */

  public getFiltered(req: Request, res: Response, next: NextFunction) {
    // Define validation schema
    const schema = Joi.object({
      varietyId: Joi.string().optional(),
      clusterId: Joi.string().optional(),
    }).or('varietyId', 'clusterId');
    // Call validator middleware
    const error_msg = 'Error validating query params to get phenologies';
    validatorMiddleware(req, res, next, req.query, schema, error_msg);
  }

  public create(req: Request, res: Response, next: NextFunction) {
    // Define validation schema
    const schema = Joi.object<PhenologyI>({
      varietyId: Joi.string().required(),
      clusterId: Joi.string().required(),
      name: Joi.string().required(),
      days: Joi.number().min(0).integer().required(),
    });
    // Call validator middleware
    const error_msg = 'Error validating body to create phenology';
    validatorMiddleware(req, res, next, req.body, schema, error_msg);
  }

  public update(req: Request, res: Response, next: NextFunction) {
    // Define validation schema
    const schema = Joi.object<PhenologyI>({
      name: Joi.string().optional(),
      days: Joi.number().min(0).integer().optional(),
    });
    // Call validator middleware
    const error_msg = 'Error validating body to update phenology';
    validatorMiddleware(req, res, next, req.body, schema, error_msg);
  }
}

export default new PhenologyValidator();
