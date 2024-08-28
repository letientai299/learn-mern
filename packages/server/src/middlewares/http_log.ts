import { NextFunction, Request, Response } from 'express';
import { getRequestId } from './request_id.js';
import prettyMs from 'pretty-ms';

export function httpLog(req: Request, res: Response, next: NextFunction) {
  const reqId = getRequestId(req);

  const lg = req.ctx.lg.child({ reqId: reqId });
  let reqSize = 0;
  req.on('data', (chunk) => {
    reqSize += Buffer.from(chunk as never).length;
  });

  req.ctx.lg = lg;
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const data = {
      method: req.method,
      url: req.originalUrl,
      params: req.params,
      status: res.statusCode,
      reqSize: reqSize,
      latency: prettyMs(Number(process.hrtime.bigint() - start) / 1e6),
    };
    lg.info(data);
  });

  next();
}
