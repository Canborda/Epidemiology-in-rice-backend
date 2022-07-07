import { NextFunction, Request, Response } from 'express';

import { OPERATIONS } from '../utils/constants';
import { ExistenceError } from '../utils/errors';

import { MapI, MapModel } from '../models/map.model';
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
      res.locals.content = { data: result };
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

  //#endregion

  //#region Existence validators

  private async validateName(owner: string, name: string) {
    const exists = await MapModel.findOne({ owner, name });
    if (exists) {
      throw new ExistenceError('A map with this name already exists for the user', { name });
    }
  }

  //#endregion
}

export default new MapController();
