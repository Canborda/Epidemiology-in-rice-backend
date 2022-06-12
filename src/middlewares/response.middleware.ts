import { Request, Response } from 'express';

export default async (req: Request, res: Response) => {
  const { status, operation, content } = res.locals;
  // Send response
  if (operation) {
    console.log(`New SUCCESS for ${operation}.`);
    res.status(status || 200).json(content);
  } else {
    console.log('UNKNOWN REQUEST');
    const info = {
      method: req.method,
      endpoint: req.url,
    };
    console.log(JSON.stringify(info));
    res.status(405).json(info);
  }
};
