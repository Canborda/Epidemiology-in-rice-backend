import { NextFunction, Request, Response } from 'express';

import { OPERATIONS } from '../utils/constants';
import { ExistenceError, NonExistenceError } from '../utils/errors';

import { MapI, MapModel } from '../models/map.model';
import { CropModel } from '../models/crop.model';
import { UserI } from '../models/user.model';

class MapController {
  /**
   * This controller contains the CRUD for the [maps] collection.
   * All endpoints are exposed for the frontend.
   */

  //#region CRUD

  public async get(req: Request, res: Response, next: NextFunction) {
    try {
      const user: UserI = res.locals.user;
      // Retrieve filtered documents
      const result = await MapModel.find({ owner: user._id });
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.maps.get;
      res.locals.content = { count: result.length, data: result };
      next();
    } catch (error) {
      next(error);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user: UserI = res.locals.user;
      const map: MapI = res.locals.schema;
      // Asign owner to new document
      map.owner = user._id;
      // Check if crop exists
      await this.validateCrop(map.crop);
      // Find if aleady exists a map with same name for the same user
      await this.validateName(user._id, map.name);
      // Insert new document
      const result = await MapModel.create(map);
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.maps.create;
      res.locals.content = { data: result };
      res.locals.status = 201;
      next();
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const user: UserI = res.locals.user;
      const map: MapI = res.locals.schema;
      const { map_id } = req.params;
      // Find map (if exists)
      const result = await this.findUserMap(user._id, map_id);
      // Update fields (if given)
      if (map.crop) {
        await this.validateCrop(map.crop);
        result.crop = map.crop;
      }
      if (map.name) {
        await this.validateName(user._id, map.name);
        result.name = map.name;
      }
      if (map.seedDate) result.seedDate = map.seedDate;
      if (map.polygon) result.polygon = map.polygon;
      await result.save();
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.maps.update;
      res.locals.status = 204;
      next();
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const user: UserI = res.locals.user;
      const { map_id } = req.params;
      // Find map (if exists)
      const result = await this.findUserMap(user._id, map_id);
      // Remove map
      await result.delete();
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.maps.delete;
      res.locals.status = 204;
      next();
    } catch (error) {
      next(error);
    }
  }

  //#endregion

  //#region Existence validators

  private async validateName(owner: string, name: string) {
    const exists = await MapModel.findOne({ owner, name });
    if (exists) {
      throw new ExistenceError('A map with this name already exists for the user', { name });
    }
  }

  private async validateCrop(crop_id: string) {
    const exists = await CropModel.findById(crop_id);
    if (!exists) throw new NonExistenceError('Crop not found for given params', { crop_id });
  }

  private async findUserMap(user_id: string, map_id: string): Promise<MapI> {
    const result = await MapModel.findOne({ owner: user_id, _id: map_id });
    if (!result) {
      throw new NonExistenceError('Map does not exists or does not belong to user', { user_id, map_id });
    }
    return result;
  }

  //#endregion
}

export default new MapController();
