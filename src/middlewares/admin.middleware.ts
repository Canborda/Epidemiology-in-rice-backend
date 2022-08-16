import { NextFunction, Request, Response } from 'express';

import { AuthenticationError } from '../utils/errors';

import { RolesOptions, UserI } from '../models/user.model';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: UserI = res.locals.user;
    if (user.role !== RolesOptions.ADMIN) {
      throw new AuthenticationError(
        'User has no needed permissions',
        `Current role: ${RolesOptions[user.role]}`,
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};
