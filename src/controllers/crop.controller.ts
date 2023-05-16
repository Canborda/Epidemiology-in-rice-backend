import { NextFunction, Request, Response } from 'express';

import { OPERATIONS } from '../utils/constants';

import { UserI } from '../models/dtos/user.model';
import { CropI, CropModel } from '../models/dtos/crop.model';
import { MapI } from '../models/dtos/map.model';
import { PhenologyResponseI } from '../models/interfaces';

import cropService from '../services/crop.service';
import mapService from '../services/map.service';
import commonService from '../services/common.service';

class CropController {
  /**
   * Contains the CRUD for the [crops] collection.
   * Constains FLOWS to retrieve crop data requested from the front.
   * GET endpoint is available for all users, remaining endpoints are only for admin users.
   */

  // #region CRUD methods

  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result: CropI[] = await CropModel.find();
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
      // Find if already exist a variety
      await cropService.validateCrop(crop.variety);
      // Insert new document
      const newCrop: CropI = await CropModel.create(crop);
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.crops.create;
      res.locals.content = { data: newCrop };
      res.locals.status = 201;
      next();
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { crop_id } = req.params;
      const newCrop: CropI = res.locals.schema;
      // Find crop (if exists)
      const oldCrop: CropI = await cropService.findCrop(crop_id);
      // Update fields (if exists)
      if (newCrop.phenology) oldCrop.phenology = newCrop.phenology;
      await oldCrop.save();
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
      const crop: CropI = await cropService.findCrop(crop_id);
      // Remove crop
      await crop.delete();
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.crops.delete;
      res.locals.status = 204;
      next();
    } catch (error) {
      next(error);
    }
  }

  // #endregion

  // #region FLOW methods

  public async getPhenologyIndexValues(req: Request, res: Response, next: NextFunction) {
    try {
      const user: UserI = res.locals.user;
      const { map_id, index } = res.locals.schema;
      const map: MapI = await mapService.findMap(user._id, map_id, false);
      const crop: CropI = await cropService.findCrop(map.crop);
      // 1. Iterate over phenology stages
      const indexValues: PhenologyResponseI[] = [];
      crop.phenology.forEach(stage => {
        // 2. Find if current stage has the index
        const storedIndex = stage.indexes.find(idx => idx.name === index);
        if (storedIndex) {
          // 3. Add stored data to response array
          indexValues.push({
            name: stage.name,
            date: commonService.advanceDays(map.seedDate, stage.days),
            value: storedIndex.value,
          });
        }
      });
      const result: PhenologyResponseI[] = indexValues;
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.crops.phenology;
      res.locals.content = { count: result.length, data: result };
      next();
    } catch (error) {
      next(error);
    }
  }

  // #endregion
}

export default new CropController();
