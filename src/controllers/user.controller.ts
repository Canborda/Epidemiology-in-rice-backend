import { NextFunction, Request, Response } from 'express';
import jsonwebtoken from 'jsonwebtoken';

import { AuthenticationError, ExistenceError } from '../utils/errors';
import { encryptData } from '../utils/functions';
import { OPERATIONS } from '../utils/constants';

import { UserModel } from '../models/user.model';

class UserController {
  /**
   * This controller contains the CRUD for the [users] collection.
   * All endpoints are exposed for the frontend.
   */

  //#region AUTHENTICATION

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      // Find if user exists
      const { email, password } = res.locals.schema;
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Incorrect email', email);
      }
      // Verify password
      //TODO send encrypted password and remove encryptData()
      if (encryptData(password) !== user.password) {
        throw new AuthenticationError('Incorrect password');
      }
      // Generate access_token
      const secretKey = process.env.SECRET_KEY || '';
      const expires_in = 30 * 60;
      const access_token = jsonwebtoken.sign(res.locals.schema, secretKey, { expiresIn: expires_in });
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.user.login;
      res.locals.content = { access_token, token_type: 'Bearer', expires_in, scope: '' };
      next();
    } catch (error) {
      next(error);
    }
  }

  //#endregion

  //#region CRUD

  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      // Find if the user already exists
      await this.validateEmail(res.locals.schema.email);
      // Encrypt password
      res.locals.schema.password = encryptData(res.locals.schema.password);
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
