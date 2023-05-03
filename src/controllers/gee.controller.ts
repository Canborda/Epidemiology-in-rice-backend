import { NextFunction, Request, Response } from 'express';

import { OPERATIONS } from '../utils/constants';
import { MapModel } from '../models/dtos/map.model';
import { UserI } from '../models/dtos/user.model';
import { BaseError, NonExistenceError } from '../utils/errors';
import { decryptData } from '../utils/functions';

import geeService from '../services/gee.service';

const ee = require('@google/earthengine');

class GeeController {
  /**
   * This controler handles the GEE services requested from the frontend.
   */

  // #region SCRIPT methods

  public async getIndexes(req: Request, res: Response, next: NextFunction) {
    try {
      // Use GEE service
      ee.data.authenticateViaPrivateKey(
        this.getCredentials(),
        () => {
          const result = geeService.getIndexes();
          // Add data to response and go to responseMiddleware
          res.locals.operation = OPERATIONS.gee.indexes;
          res.locals.content = { data: result };
          next();
        },
        (e: any) => next(e),
      );
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  public async getImages(req: Request, res: Response, next: NextFunction) {
    try {
      const user: UserI = res.locals.user;
      const { map_id } = res.locals.schema;
      // Get coordinates
      const map = await MapModel.findOne({ owner: user._id, _id: map_id });
      if (!map) {
        throw new NonExistenceError('Map does not exists or does not belong to user', {
          user_id: user._id,
          map_id,
        });
      }
      // Use GEE service
      ee.data.authenticateViaPrivateKey(
        this.getCredentials(),
        () => {
          const polygon = this.invertCoordinates(map.polygon);
          const result = geeService.getImages(polygon);
          // Add data to response and go to responseMiddleware
          res.locals.operation = OPERATIONS.gee.images;
          res.locals.content = { data: result };
          next();
        },
        (e: any) => next(e),
      );
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  public async test(req: Request, res: Response, next: NextFunction) {
    try {
      ee.data.authenticateViaPrivateKey(
        // Autentication via private key
        this.getCredentials(),
        // Success callback
        () => {
          const result = geeService.test();
          // Add data to response and go to responseMiddleware
          res.locals.operation = 'GEE TEST';
          res.locals.content = { data: result };
          next();
        },
        // Error callback
        (e: any) => next(e),
      );
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  // #endregion

  // #region Auxiliar methods

  private getCredentials(): string {
    // Load an validate environment variables
    const gcPrivateKey = process.env.PRIVATE_KEY || '';
    if (!gcPrivateKey.length) throw new BaseError('Missing PRIVATE_KEY environment variable');
    return JSON.parse(decryptData(gcPrivateKey));
  }

  private invertCoordinates(coordinates: Float32List[]): Float32List[] {
    return coordinates.map(point => [point[1], point[0]]);
  }

  // #endregion
}

export default new GeeController();
