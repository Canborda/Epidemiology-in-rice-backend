import { NextFunction, Request, Response } from 'express';
import { OPERATIONS } from '../utils/constants';

class UserController {
  public login(req: Request, res: Response, next: NextFunction) {
    try {
      const message = 'INSIDE USER LOGIN CONTROLLER';
      console.log(message);
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.user.login;
      res.locals.content = { message };
      next();
    } catch (error) {
      next(error);
    }
  }

  public register(req: Request, res: Response, next: NextFunction) {
    try {
      const message = 'INSIDE USER REGISTER CONTROLLER';
      console.log(message);
      // Add data to response and go to responseMiddleware
      res.locals.operation = OPERATIONS.user.register;
      res.locals.content = { message };
      next();
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
