import express from 'express';
import cors from 'cors';

import { ensureRequestId } from './request_id.js';
import { httpLog } from './http_log.js';
import { checkBody } from './check_body.js';

function setup(app: express.Application) {
  app.disable('x-powered-by');
  app.use(ensureRequestId);
  app.use(httpLog);

  // middlewares that process request body and headers must be used after
  // those middlewares that setup events and contribute headers.
  app.use(cors());
  app.use(express.json());
}

export default {
  setup,
  checkBody,
};
