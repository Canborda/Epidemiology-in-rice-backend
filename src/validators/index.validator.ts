import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { INDEXES } from '../utils/enums';

import { IndexI } from '../models/dtos/index.model';

import validatorMiddleware from '../middlewares/validator.middleware';

class IndexValidator {
  /**
   * Validates the request bodies or query_params from INDEX routes.
   */

  public getFiltered(req: Request, res: Response, next: NextFunction) {
    // Define validation schema
    const schema = Joi.object({
      varietyId: Joi.string().optional(),
      clusterId: Joi.string().optional(),
      phenologyId: Joi.string().optional(),
    }).or('varietyId', 'clusterId', 'phenologyId');
    // Call validator middleware
    const error_msg = 'Error validating query params to get indexes';
    validatorMiddleware(req, res, next, req.query, schema, error_msg);
  }

  public create(req: Request, res: Response, next: NextFunction) {
    // Define validation schema
    const schema = Joi.object<IndexI>({
      varietyId: Joi.string().required(),
      clusterId: Joi.string().required(),
      phenologyId: Joi.string().required(),
      name: Joi.string()
        .valid(...Object.values(INDEXES))
        .required(),
      mean: Joi.number().required(),
      min: Joi.number().required(),
      max: Joi.number().required(),
    });
    // Call validator middleware
    const error_msg = 'Error validating body to create index';
    validatorMiddleware(req, res, next, req.body, schema, error_msg);
  }

  public update(req: Request, res: Response, next: NextFunction) {
    // Define validation schema
    const schema = Joi.object<IndexI>({
      mean: Joi.number().optional(),
      min: Joi.number().optional(),
      max: Joi.number().optional(),
    });
    // Call validator middleware
    const error_msg = 'Error validating body to update index';
    validatorMiddleware(req, res, next, req.body, schema, error_msg);
  }
}

export default new IndexValidator();
