import { NextFunction, Request, Response } from 'express';

import { OPERATIONS } from '../utils/constants';
import { ExistenceError, NonExistenceError } from '../utils/errors';

import { MapModel } from '../models/map.model';
import { UserModel } from '../models/user.model';

class MapController {
  /**
   * This controller contains the CRUD for the [maps] collection.
   * All endpoints are exposed for the frontend.
   */

  //#region CRUD

  public async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, mapId } = res.locals.schema;
      // Find if user already exists
      await this.validateUserId(userId);
      // Retrieve filtered documents
      const result = mapId ? await MapModel.findById(mapId) : await MapModel.find({ userId });
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.maps.get;
      res.locals.content = { data: result };
      next();
    } catch (error) {
      next(error);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      // Find if user and map aleady exists
      await this.validateName(res.locals.schema.name);
      await this.validateUserId(res.locals.schema.userId);
      // Insert new document
      const result = await MapModel.create(res.locals.schema);
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.maps.create;
      res.locals.content = { data: result };
      res.locals.status = 201;
      next();
    } catch (error) {
      next(error);
    }
  }

  //#endregion

  //#region Existence validators

  private async validateUserId(userId: string) {
    const exists = await UserModel.findById(userId);
    if (!exists) {
      throw new NonExistenceError('The user does not exist', { userId });
    }
  }

  private async validateName(name: string) {
    const exists = await MapModel.findOne({ name });
    if (exists) {
      throw new ExistenceError('A map with this name already exists', { name });
    }
  }

  //#endregion
}

export default new MapController();
