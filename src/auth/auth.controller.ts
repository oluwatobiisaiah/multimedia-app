import { Request, Response } from 'express';

export const authController = {
  login: (req: Request, res: Response) => {
    
    res.send('Hello from auth controller!');
  },
};

