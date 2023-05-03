import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import validatorMiddleware from '../middlewares/validator.middleware';
import { INDEXES } from '../utils/enums';

import { CropI, PhenologyI, IndexI } from '../models/dtos/crop.model';

class CropValidator {
  /**
   * This class validates the requests from CROP routes
   */

  private phenologySchema = Joi.object<PhenologyI>({
    name: Joi.string().required(),
    days: Joi.number().required(),
    indexes: Joi.array()
      .items(
        Joi.object<IndexI>({
          name: Joi.string()
            .valid(...Object.values(INDEXES))
            .required(),
          value: Joi.number().required(),
        }),
      )
      .required(),
  });

  public create(req: Request, res: Response, next: NextFunction) {
    // Define validation schema
    const schema = Joi.object<CropI>({
      name: Joi.string().required(),
      variety: Joi.string().required(),
      phenology: Joi.array().items(this.phenologySchema).required(),
    });
    // Call validator middleware
    const error_msg = 'Error validating body to create crop';
    validatorMiddleware(req, res, next, req.body, schema, error_msg);
  }

  public update(req: Request, res: Response, next: NextFunction) {
    // Define validation schema
    const schema = Joi.object({
      phenology: Joi.array().items(this.phenologySchema).required(),
    });
    // Call validator middleware
    const error_msg = 'Error validating body to update crop';
    validatorMiddleware(req, res, next, req.body, schema, error_msg);
  }
}

export default new CropValidator();
