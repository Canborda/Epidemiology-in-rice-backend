import { NextFunction, Request, Response } from 'express';

import { ROLES } from '../utils/enums';
import { AuthenticationError } from '../utils/errors';

import { UserI } from '../models/user.model';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: UserI = res.locals.user;
    if (user.role !== ROLES.ADMIN) {
      throw new AuthenticationError('User has no needed permissions', `Current role: ${ROLES[user.role]}`);
    }
    next();
  } catch (error) {
    next(error);
  }
};
