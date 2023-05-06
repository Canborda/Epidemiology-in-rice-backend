import { NextFunction, Request, Response } from 'express';

import { OPERATIONS } from '../utils/constants';
import { BaseError, NonExistenceError } from '../utils/errors';
import { decryptData } from '../utils/functions';

import { UserI } from '../models/dtos/user.model';
import { MapI, MapModel } from '../models/dtos/map.model';
import { ImagesResponseI, ValuesResponseI } from '../models/interfaces';

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
      const { map_id, index, cloudyPercentage } = res.locals.schema;
      const map = await this.getMap(user._id, map_id);
      // Use GEE service
      ee.data.authenticateViaPrivateKey(
        this.getCredentials(),
        () => {
          // 1. Get latest image
          const image = geeService.selectImage(map.polygon, cloudyPercentage);
          // 2. Extract properties
          const imageUrl = geeService.generateImageUrl(image, index);
          const imageDate = geeService.getImageDate(image);
          const imageBbox = geeService.getPolygonBoundingBox(map.polygon);
          // 3. Pack result
          const result: ImagesResponseI = {
            url: imageUrl,
            date: imageDate,
            bbox: imageBbox,
          };
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

  public async getValues(req: Request, res: Response, next: NextFunction) {
    try {
      const user: UserI = res.locals.user;
      const { map_id, index, cloudyPercentage } = res.locals.schema;
      const map = await this.getMap(user._id, map_id);
      // Use GEE service
      ee.data.authenticateViaPrivateKey(
        this.getCredentials(),
        () => {
          ee.initialize();
          // 1. Get latest image
          const image = geeService.selectImage(map.polygon, cloudyPercentage);
          // 2. Extract index value for each pixel on the geometry
          const pixels = geeService.extractPixels(image, index, map.polygon);
          // 3. Calculate mean
          const mean = geeService.calculatePixelsAverage(pixels);
          // 4. Pack result
          const result: ValuesResponseI = { pixels, mean };
          // Add data to response and go to responseMiddleware
          res.locals.operation = OPERATIONS.gee.values;
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

  private async getMap(userId: string, mapId: string): Promise<MapI> {
    const map = await MapModel.findOne({ owner: userId, _id: mapId });
    if (!map) {
      throw new NonExistenceError('Map does not exists or does not belong to user', {
        userId,
        mapId,
      });
    }
    map.polygon = this.invertCoordinates(map.polygon);
    return map;
  }

  private invertCoordinates(coordinates: Float32List[]): Float32List[] {
    return coordinates.map(point => [point[1], point[0]]);
  }

  // #endregion
}

export default new GeeController();
