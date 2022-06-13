import { NextFunction, Request, Response } from 'express';

import { OPERATIONS } from '../utils/constants';

import { MapModel } from '../models/map.model';

class MapController {
  /**
   * This controller contains the CRUD for the [maps] collection.
   * All endpoints are exposed for the frontend.
   */

  //#region CRUD

  public async get(req: Request, res: Response, next: NextFunction) {
    try {
      //TODO implement method
      const result = 'INSIDE GET ALL MAPS';
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
      //TODO implement method
      const result = 'INSIDE CREATE MAP';
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
}

export default new MapController();
