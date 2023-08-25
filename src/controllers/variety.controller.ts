import { NextFunction, Request, Response } from 'express';

import { OPERATIONS } from '../utils/constants';

import { VarietyI } from '../models/dtos/variety.model';

import varietyService from '../services/variety.service';

class VarietyController {
  /**
   * Contains the CRUD for the [varieties] collection.
   * GET requests are available for all users.
   * POST, PATCH & DELETE requests are only for admin.
   */

  // #region CRUD methods

  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result: VarietyI[] = await varietyService.getAllVarieties();
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.varieties.getAll;
      res.locals.content = { count: result.length, data: result };
      next();
    } catch (error) {
      next(error);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const variety: VarietyI = res.locals.schema;
      const newVariety: VarietyI = await varietyService.createVariety(variety);
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.varieties.create;
      res.locals.content = { data: newVariety };
      res.locals.status = 201;
      next();
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      // Retrieve data from DB
      const { varietyId } = req.params;
      const reqVariety: VarietyI = res.locals.schema;
      const dbVariety: VarietyI = await varietyService.getVarietyById(varietyId);
      // Update fields & save
      dbVariety.name = reqVariety.name;
      await dbVariety.save();
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.varieties.update;
      res.locals.content = { data: dbVariety };
      next();
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { varietyId } = req.params;
      const variety: VarietyI = await varietyService.getVarietyById(varietyId);
      variety.delete();
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.varieties.delete;
      res.locals.status = 204;
      next();
    } catch (error) {
      next(error);
    }
  }

  // #endregion
}

export default new VarietyController();
