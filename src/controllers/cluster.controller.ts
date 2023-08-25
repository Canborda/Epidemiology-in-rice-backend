import { NextFunction, Request, Response } from 'express';

import { OPERATIONS } from '../utils/constants';

import { ClusterI } from '../models/dtos/cluster.model';

import clusterService from '../services/cluster.service';

class ClusterController {
  /**
   * Contains the CRUD for the [clusters] collection.
   * GET requests are available for all users.
   * POST, PATCH & DELETE requests are only for admin.
   */

  // #region CRUD methods

  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result: ClusterI[] = await clusterService.getAllClusters();
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.clusters.getAll;
      res.locals.content = { count: result.length, data: result };
      next();
    } catch (error) {
      next(error);
    }
  }

  public async getFiltered(req: Request, res: Response, next: NextFunction) {
    try {
      const { varietyId } = req.query;
      const result: ClusterI[] = await clusterService.getFilterdClusters(varietyId as string);
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.clusters.getFiltered;
      res.locals.content = { count: result.length, data: result };
      next();
    } catch (error) {
      next(error);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const cluster: ClusterI = res.locals.schema;
      const newCluster: ClusterI = await clusterService.createCluster(cluster);
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.clusters.create;
      res.locals.content = { data: newCluster };
      res.locals.status = 201;
      next();
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      // Retrieve data from DB
      const { clusterId } = req.params;
      const reqCluster: ClusterI = res.locals.schema;
      const dbCluster: ClusterI = await clusterService.getClusterById(clusterId);
      // Check unique fields
      if (reqCluster.name) await clusterService.validateName(dbCluster.varietyId, reqCluster.name);
      // Update given fields & save
      if (reqCluster.name) dbCluster.name = reqCluster.name;
      if (reqCluster.polygon) dbCluster.polygon = reqCluster.polygon;
      await dbCluster.save();
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.clusters.update;
      res.locals.content = { data: dbCluster };
      next();
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { clusterId } = req.params;
      const cluster: ClusterI = await clusterService.getClusterById(clusterId);
      cluster.delete();
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.clusters.delete;
      res.locals.status = 204;
      next();
    } catch (error) {
      next(error);
    }
  }

  // #endregion
}

export default new ClusterController();
