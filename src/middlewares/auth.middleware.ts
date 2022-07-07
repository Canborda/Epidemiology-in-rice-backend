import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { AuthenticationError } from '../utils/errors';

import { UserModel } from '../models/user.model';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    //  Check if token exists
    const access_token = req.headers.authorization;
    if (!access_token) {
      throw new AuthenticationError('The request has no authentication token');
    }
    const secretKey = process.env.SECRET_KEY || '';
    let email = '';
    // Verify access_token
    jwt.verify(access_token.split(' ')[1], secretKey, (error, decoded) => {
      if (error) {
        throw new AuthenticationError('Invalid token', error.message);
      }
      const payload = decoded as JwtPayload;
      email = payload['email'];
    });
    // Find user for given credentials
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new AuthenticationError('User not found for given access_token', email);
    }
    // Add data to locals to use in controllers
    res.locals.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
