import { NextFunction, Request, Response } from 'express';
import geeService from '../services/gee.service';

const ee = require('@google/earthengine');

class GeeController {
  /**
   * This controler handles the GEE services requested from the frontend.
   */

  public async post(req: Request, res: Response, next: NextFunction) {
    try {
      const privateKey = req.body; //TODO encrypt private key
      ee.data.authenticateViaPrivateKey(
        // Autentication via private key
        privateKey,
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
}

export default new GeeController();
