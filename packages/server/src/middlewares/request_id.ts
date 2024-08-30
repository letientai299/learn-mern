import type { NextFunction, Request, Response } from 'express';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('1234567890abcdef');

const X_REQUEST_ID = 'X-Request-Id';

export function getRequestId(req: Request) {
  let reqID = req.get(X_REQUEST_ID);
  if (!reqID) {
    reqID = `rid_${nanoid()}`;
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
