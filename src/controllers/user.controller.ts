import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { OPERATIONS } from '../utils/constants';
import { AuthenticationError, ExistenceError, NonExistenceError } from '../utils/errors';

import { RolesOptions, UserI, UserModel } from '../models/user.model';

class UserController {
  /**
   * Contains authentication methods and CRUD for the [users] collection.
   * All endpoints are exposed for the frontend.
   */

  //#region AUTHENTICATION

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      // Find if user exists
      const { email, password } = res.locals.schema;
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Email incorrecto o no registrado', email);
      }
      // Verify password
      //TODO send encrypted password and remove encryptData()?
      if (!(await user.comparePassword(password))) {
        throw new AuthenticationError('Contraseña incorrecta');
      }
      // Generate access_token
      const secretKey = process.env.SECRET_KEY || '';
      const expires_in = 30 * 60;
      const access_token = jwt.sign({ _id: user._id }, secretKey, { expiresIn: expires_in });
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.users.login;
      res.locals.content = { access_token, token_type: 'Bearer', expires_in, scope: '' };
      next();
    } catch (error) {
      next(error);
    }
  }

  public async makeAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const user: UserI = res.locals.user;
      const { user_id } = req.params;
      // Find user
      const result = await UserModel.findById(user_id);
      if (!result) {
        throw new NonExistenceError('User not found', { user_id });
      }
      // Update user role
      result.role = RolesOptions.ADMIN;
      await result.save();
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.users.makeAdmin;
      res.locals.status = 204;
      next();
    } catch (error) {
      next(error);
    }
  }

  //#endregion

  //#region CRUD

  public async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user: UserI = res.locals.user;
      // Filter user info
      const result = {
        role: user.role,
        email: user.email,
        name: user.name,
        region: user.region,
      };
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.users.get;
      res.locals.content = { data: result };
      next();
    } catch (error) {
      next(error);
    }
  }

  public async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      // Find if the user already exists
      await this.validateEmail(res.locals.schema.email);
      // Insert new document (password encrypted on UserModel)
      const result = await UserModel.create(res.locals.schema);
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.users.signup;
      res.locals.content = { data: result, message: 'Usuario creado correctamente' };
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
      throw new ExistenceError('Este email ya se encuentra registrado', { email });
    }
  }

  //#endregion
}

export default new UserController();
