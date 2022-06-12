import { NextFunction, Request, Response } from 'express';

import { OPERATIONS } from '../utils/constants';
import { ExistenceError } from '../utils/errors';

import { UserModel } from '../models/user.model';

class UserController {
  /**
   * This controller contains the CRUD for the [users] collection.
   * All endpoints are exposed for the frontend.
   */

  //#region CRUD

  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      // Find if the user already exists
      await this.validateEmail(res.locals.schema.email);
      // Insert new document
      const result = await UserModel.create(res.locals.schema);
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.user.register;
      res.locals.content = { data: result };
      res.locals.status = 201;
      next();
    } catch (error) {
      next(error);
    }
  }

  //#endregion

  //#region Existence validators

  private async validateEmail(email: string) {
    const exists = await UserModel.findOne({ email });
    if (exists) {
      throw new ExistenceError('This email is already registered', { email });
    }
  }

  //#endregion
}

export default new UserController();
