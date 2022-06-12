import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

export default function (req: Request, res: Response, next: NextFunction) {
  try {
    console.log('INSIDE VALIDATOR MIDDLEWARE');
    next();
  } catch (error) {
    next(error);
  }
}
