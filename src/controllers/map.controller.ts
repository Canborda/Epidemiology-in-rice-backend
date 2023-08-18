import { NextFunction, Request, Response } from 'express';

import { OPERATIONS } from '../utils/constants';

import { UserI } from '../models/dtos/user.model';
import { MapI, MapModel } from '../models/dtos/map.model';

import cropService from '../services/crop.service';
import mapService from '../services/map.service';

class MapController {
  /**
   * This controller contains the CRUD for the [maps] collection.
   * All endpoints are exposed for the frontend only for REQUESTING USER.
   */

  // #region CRUD methods

  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const user: UserI = res.locals.user;
      // Retrieve filtered documents
      const result: MapI[] = await MapModel.find({ owner: user._id });
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
      await cropService.getCropById(map.crop);
      // Find if aleady exists a map with same name for the same user
      await mapService.validateMapName(user._id, map.name);
      // Insert new document
      const newMap: MapI = await MapModel.create(map);
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.maps.create;
      res.locals.content = { data: newMap };
      res.locals.status = 201;
      next();
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { map_id } = req.params;
      const user: UserI = res.locals.user;
      const newMap: MapI = res.locals.schema;
      // Find map (if exists)
      const oldMap: MapI = await mapService.findMap(user._id, map_id, false);
      // Update fields (if given)
      if (newMap.crop) {
        await cropService.getCropById(newMap.crop);
        oldMap.crop = newMap.crop;
      }
      if (newMap.name) {
        await mapService.validateMapName(user._id, newMap.name, oldMap.name);
        oldMap.name = newMap.name;
      }
      if (newMap.seedDate) oldMap.seedDate = newMap.seedDate;
      if (newMap.polygon) oldMap.polygon = newMap.polygon;
      await oldMap.save();
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
      const { map_id } = req.params;
      const user: UserI = res.locals.user;
      // Find map (if exists)
      const map: MapI = await mapService.findMap(user._id, map_id, false);
      // Remove map
      await map.delete();
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.maps.delete;
      res.locals.status = 204;
      next();
    } catch (error) {
      next(error);
    }
  }

  // #endregion
}

export default new MapController();
