import { NextFunction, Request, Response } from 'express';

import { OPERATIONS } from '../utils/constants';
import { ExistenceError, NonExistenceError } from '../utils/errors';

import { CropI, CropModel } from '../models/crop.model';

class CropController {
  /**
   * Contains the CRUD for the [crops] collection.
   * GET endpoint is available for all users, remaining endpoints are only for admin users.
   */

  //#region CRUD

  public async get(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CropModel.find();
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.crops.get;
      res.locals.content = { count: result.length, data: result };
      next();
    } catch (error) {
      next(error);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const crop: CropI = res.locals.schema;
      // Find if already exist a name-variety crop combination
      const filter = { name: crop.name, variety: crop.variety };
      const exists = await CropModel.findOne(filter);
      if (exists) {
        throw new ExistenceError('A crop with the same name-variety already exists', filter);
      }
      // Insert new document
      const result = await CropModel.create(crop);
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.crops.create;
      res.locals.content = { data: result };
      res.locals.status = 201;
      next();
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { crop_id } = req.params;
      const crop: CropI = res.locals.schema;
      // Find crop (if exists)
      const result = await this.findCrop(crop_id);
      // Update fields (if exists)
      if (crop.phenology) result.phenology = crop.phenology;
      await result.save();
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.crops.update;
      res.locals.status = 204;
      next();
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { crop_id } = req.params;
      // Find crop (if exists)
      const result = await this.findCrop(crop_id);
      // Remove crop
      await result.delete();
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.crops.delete;
      res.locals.status = 204;
      next();
    } catch (error) {
      next(error);
    }
  }

  //#endregion

  //#region Existence validators

  private async findCrop(crop_id: string): Promise<CropI> {
    const result = await CropModel.findById(crop_id);
    if (!result) throw new NonExistenceError('Crop not found for given params', { crop_id });
    return result;
  }

  //#endregion
}

export default new CropController();
