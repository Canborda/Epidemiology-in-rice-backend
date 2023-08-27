import { NextFunction, Request, Response } from 'express';

import { OPERATIONS } from '../utils/constants';

import { IndexI } from '../models/dtos/index.model';

import indexService from '../services/index.service';

class IndexController {
  /**
   * Contains the CRUD for the [indexes] collection.
   * GET requests are available for all users.
   * POST, PATCH & DELETE requests are only for admin.
   */

  // #region CRUD methods

  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result: IndexI[] = await indexService.getAllIndexes();
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.indexes.getAll;
      res.locals.content = { count: result.length, data: result };
      next();
    } catch (error) {
      next(error);
    }
  }

  public async getFiltered(req: Request, res: Response, next: NextFunction) {
    try {
      const { varietyId, clusterId, phenologyId } = req.query;
      const result: IndexI[] = await indexService.getFilterdIndexes(
        varietyId as string,
        clusterId as string,
        phenologyId as string,
      );
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.indexes.getFiltered;
      res.locals.content = { count: result.length, data: result };
      next();
    } catch (error) {
      next(error);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const index: IndexI = res.locals.schema;
      const newIndex: IndexI = await indexService.createIndex(index);
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.indexes.create;
      res.locals.content = { data: newIndex };
      res.locals.status = 201;
      next();
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      // Retrieve data from DB
      const { indexId } = req.params;
      const reqIndex: IndexI = res.locals.schema;
      const dbIndex: IndexI = await indexService.getIndexById(indexId);
      // Update given fields & save
      if (reqIndex.mean !== undefined) dbIndex.mean = reqIndex.mean;
      if (reqIndex.min !== undefined) dbIndex.min = reqIndex.min;
      if (reqIndex.max !== undefined) dbIndex.max = reqIndex.max;
      await dbIndex.save();
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.indexes.update;
      res.locals.content = { data: dbIndex };
      next();
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { indexId } = req.params;
      const index: IndexI = await indexService.getIndexById(indexId);
      index.delete();
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.indexes.delete;
      res.locals.status = 204;
      next();
    } catch (error) {
      next(error);
    }
  }

  // #endregion
}

export default new IndexController();
