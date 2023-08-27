import { NextFunction, Request, Response } from 'express';

import { OPERATIONS } from '../utils/constants';

import { PhenologyI } from '../models/dtos/phenology.model';

import phenologyService from '../services/phenology.service';

class PhenologyController {
  /**
   * Contains the CRUD for the [phenologies] collection.
   * GET requests are available for all users.
   * POST, PATCH & DELETE requests are only for admin.
   */

  // #region CRUD methods

  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result: PhenologyI[] = await phenologyService.getAllPhenologies();
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.phenologies.getAll;
      res.locals.content = { count: result.length, data: result };
      next();
    } catch (error) {
      next(error);
    }
  }

  public async getFiltered(req: Request, res: Response, next: NextFunction) {
    try {
      const { varietyId, clusterId } = req.query;
      const result: PhenologyI[] = await phenologyService.getFilterdPhenologies(
        varietyId as string,
        clusterId as string,
      );
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.phenologies.getFiltered;
      res.locals.content = { count: result.length, data: result };
      next();
    } catch (error) {
      next(error);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const phenology: PhenologyI = res.locals.schema;
      const newPhenology: PhenologyI = await phenologyService.createPhenology(phenology);
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.phenologies.create;
      res.locals.content = { data: newPhenology };
      res.locals.status = 201;
      next();
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      // Retrieve data from DB
      const { phenologyId } = req.params;
      const reqPhenology: PhenologyI = res.locals.schema;
      const dbPhenology: PhenologyI = await phenologyService.getPhenologyById(phenologyId);
      // Check unique fields
      if (reqPhenology.name)
        await phenologyService.validateName(dbPhenology.varietyId, dbPhenology.clusterId, reqPhenology.name);
      // Update given fields & save
      if (reqPhenology.name) dbPhenology.name = reqPhenology.name;
      if (reqPhenology.days) dbPhenology.days = reqPhenology.days;
      await dbPhenology.save();
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.phenologies.update;
      res.locals.content = { data: dbPhenology };
      next();
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { phenologyId } = req.params;
      const phenology: PhenologyI = await phenologyService.getPhenologyById(phenologyId);
      phenology.delete();
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.phenologies.delete;
      res.locals.status = 204;
      next();
    } catch (error) {
      next(error);
    }
  }

  // #endregion
}

export default new PhenologyController();
