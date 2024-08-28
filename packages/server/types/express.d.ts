import winston from 'winston';
import mongodb from 'mongodb';
import { NextFunction } from 'express';

declare module 'express' {
  type Middleware = (req: Request, res: Response, next: NextFunction) => void;
}

declare global {
  namespace Express {
    // this works, as in make the type compatible with @types/express
    interface Request {
      ctx: App.Context;
    }
  }

  namespace App {
    interface Context {
      lg: winston.Logger;
      db: mongodb.Db;
    }
  }
}

/*
// This doesn't work. The "lg" field is available in our code,
// but isn't compatible with express builtin functions.

declare module 'express' {
  interface Request {
    lg: winston.Logger;
  }
}
 */
