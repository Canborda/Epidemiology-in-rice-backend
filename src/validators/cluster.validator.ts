import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { ClusterI } from '../models/dtos/cluster.model';

import validatorMiddleware from '../middlewares/validator.middleware';
import { CoordinatesI } from '../models/interfaces';

class ClusterValidator {
  /**
   * Validates the request bodies or query_params from CLUSTER routes.
   */

  public getFiltered(req: Request, res: Response, next: NextFunction) {
    // Define validation schema
    const schema = Joi.object({
      varietyId: Joi.string().required(),
    });
    // Call validator middleware
    const error_msg = 'Error validating query params to get clusters';
    validatorMiddleware(req, res, next, req.query, schema, error_msg);
  }

  public create(req: Request, res: Response, next: NextFunction) {
    // Define validation schema
    const schema = Joi.object<ClusterI>({
      varietyId: Joi.string().required(),
      name: Joi.string().required(),
      polygon: Joi.array()
        .items(
          Joi.object<CoordinatesI>({
            latitude: Joi.number().min(-90).max(90).required(),
            longitude: Joi.number().min(-180).max(180).required(),
          }),
        )
        .min(3)
        .required(),
    });
    // Call validator middleware
    const error_msg = 'Error validating body to create cluster';
    validatorMiddleware(req, res, next, req.body, schema, error_msg);
  }

  public update(req: Request, res: Response, next: NextFunction) {
    // Define validation schema
    const schema = Joi.object<ClusterI>({
      name: Joi.string().optional(),
      polygon: Joi.array()
        .items(
          Joi.object<CoordinatesI>({
            latitude: Joi.number().min(-90).max(90).required(),
            longitude: Joi.number().min(-180).max(180).required(),
          }),
        )
        .min(3)
        .optional(),
    });
    // Call validator middleware
    const error_msg = 'Error validating body to update cluster';
    validatorMiddleware(req, res, next, req.body, schema, error_msg);
  }
}

export default new ClusterValidator();
