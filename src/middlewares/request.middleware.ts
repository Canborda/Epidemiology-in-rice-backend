import { NextFunction, Request, Response } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
  console.log(`New ${req.method} request on ${req.url}`);
  next();
};
