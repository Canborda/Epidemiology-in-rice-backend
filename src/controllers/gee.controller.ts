import { NextFunction, Request, Response } from 'express';

import { OPERATIONS } from '../utils/constants';
import { BaseError } from '../utils/errors';
import { decryptData } from '../utils/functions';

import { UserI } from '../models/dtos/user.model';
import { CropI } from '../models/dtos/crop.model';
import { MapI } from '../models/dtos/map.model';
import { ImagesResponseI, PhenologyResponseI, ValuesResponseI } from '../models/interfaces';

import cropService from '../services/crop.service';
import mapService from '../services/map.service';
import geeService from '../services/gee.service';
import commonService from '../services/common.service';

const ee = require('@google/earthengine');

class GeeController {
  /**
   * This controler handles the GEE services requested from the frontend.
   */

  // #region FLOW methods

  public async getIndexes(req: Request, res: Response, next: NextFunction) {
    try {
      // Use GEE service
      ee.data.authenticateViaPrivateKey(
        this.getCredentials(),
        () => {
          const result: string[] = geeService.getIndexes();
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
      const { map_id, index, cloudyPercentage } = res.locals.schema;
      const user: UserI = res.locals.user;
      const map: MapI = await mapService.findMap(user._id, map_id, true);
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
      const { map_id, index, cloudyPercentage } = res.locals.schema;
      const user: UserI = res.locals.user;
      const map: MapI = await mapService.findMap(user._id, map_id, true);
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

  public async getPhenologyIndexValues(req: Request, res: Response, next: NextFunction) {
    try {
      const { map_id, index, cloudyPercentage } = res.locals.schema;
      const user: UserI = res.locals.user;
      const map: MapI = await mapService.findMap(user._id, map_id, true);
      const crop: CropI = await cropService.findCrop(map.crop);
      // Use GEE service
      ee.data.authenticateViaPrivateKey(
        this.getCredentials(),
        () => {
          ee.initialize();
          // 1. Calculate range dates
          const startDate = new Date(map.seedDate);
          const endDate = commonService.advanceDays(
            startDate,
            crop.phenology[crop.phenology.length - 1].days + 1,
          );
          // 2. Get images in range
          const imageCollection = geeService.selectImagesInRage(
            map.polygon,
            startDate,
            endDate,
            cloudyPercentage,
          );
          // 3. Iterate over images
          const indexValues: PhenologyResponseI[] = [];
          const imageCollectionList = imageCollection.toList(imageCollection.size());
          for (let i = 0; i < imageCollection.size().getInfo(); i++) {
            let image = ee.Image(imageCollectionList.get(i));
            // 4. Calculate image date
            const date = geeService.getImageDate(image);
            const isSameDate = indexValues.find(
              idx => idx.date.toISOString().slice(1, 10) === date.toISOString().slice(1, 10),
            );
            if (!isSameDate) {
              // 5. Calculate image index value
              let pixels = geeService.extractPixels(image, index, map.polygon);
              const value = geeService.calculatePixelsAverage(pixels);
              // 6. Add result to response array
              indexValues.push({ date, value });
            }
          }
          const result: PhenologyResponseI[] = indexValues;
          // Add data to response and go to responseMiddleware
          res.locals.operation = OPERATIONS.gee.phenology;
          res.locals.content = { count: result.length, data: result };
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

  // #endregion
}

export default new GeeController();
