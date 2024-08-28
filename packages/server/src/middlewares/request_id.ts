import type { NextFunction, Request, Response } from 'express';
import { v7 as uuid } from 'uuid';

const X_REQUEST_ID = 'X-Request-Id';

export function getRequestId(req: Request) {
  let reqID = req.get(X_REQUEST_ID);
  if (!reqID) {
    reqID = uuid();
  }
  return reqID;
}

export function ensureRequestId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.set(X_REQUEST_ID, getRequestId(req));
  next();
}
