import { NextFunction, Request, Response } from 'express';

import geeService from '../services/gee.service';

import { decryptData } from '../utils/functions';
import { InternalError } from '../utils/errors';

const ee = require('@google/earthengine');

class GeeController {
  /**
   * This controler handles the GEE services requested from the frontend.
   */

  private getCredentials(): string {
    // Load an validate environment variables
    const gcPrivateKey = process.env.PRIVATE_KEY || '';
    if (!gcPrivateKey.length) throw new InternalError('Missing PRIVATE_KEY environment variable');
    return JSON.parse(decryptData(gcPrivateKey));
  }

  public async post(req: Request, res: Response, next: NextFunction) {
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
}

export default new GeeController();
